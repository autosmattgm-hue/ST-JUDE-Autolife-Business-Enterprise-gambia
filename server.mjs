import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_NVIDIA_MODEL = 'z-ai/glm-5.3-flash';
const MAX_BODY_BYTES = 2_048;
const MAX_QUESTION_LENGTH = 1_000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimits = new Map();

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

function readEnvironment() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return {};
  return Object.fromEntries(
    readFileSync(envPath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const divider = line.indexOf('=');
        const key = line.slice(0, divider).trim();
        const rawValue = line.slice(divider + 1).trim();
        return [key, rawValue.replace(/^(?:"|')|(?:"|')$/g, '')];
      }),
  );
}

const environment = readEnvironment();
const nvidiaApiKey = environment.NVIDIA_API_KEY || process.env.NVIDIA_API_KEY || '';
const nvidiaModel = environment.NVIDIA_MODEL || process.env.NVIDIA_MODEL || DEFAULT_NVIDIA_MODEL;

function securityHeaders() {
  return {
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src https://www.google.com; connect-src 'self'; base-uri 'self'; object-src 'none'; form-action 'none'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    ...securityHeaders(),
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(body));
}

function isRateLimited(request) {
  const ip = request.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const requests = (rateLimits.get(ip) || []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  if (requests.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimits.set(ip, requests);
    return true;
  }
  requests.push(now);
  rateLimits.set(ip, requests);
  return false;
}

function readJson(request) {
  return new Promise((resolveBody, reject) => {
    let size = 0;
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      size += Buffer.byteLength(chunk);
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Request body too large'));
        request.destroy();
        return;
      }
      body += chunk;
    });
    request.on('end', () => {
      try {
        resolveBody(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    request.on('error', reject);
  });
}

async function answerWithNvidia(question) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const upstream = await fetch(NVIDIA_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${nvidiaApiKey}` },
      body: JSON.stringify({
        model: nvidiaModel,
        temperature: 0.3,
        max_tokens: 450,
        messages: [
          {
            role: 'system',
            content: 'You are the ST JUDE Autolife fuel-pump assistant in The Gambia. Give concise, helpful plain-English answers. Never invent prices, availability, fitment, or specifications. For exact fitment, ask for make, model, year, engine, and an old-pump/connector photo, then tell the customer to confirm on WhatsApp +220 403 0870.',
          },
          { role: 'user', content: question },
        ],
      }),
    });
    if (!upstream.ok) throw new Error(`NVIDIA response ${upstream.status}`);
    const data = await upstream.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error('Empty NVIDIA response');
    return answer.slice(0, 2_000);
  } finally {
    clearTimeout(timeout);
  }
}

function serveStatic(response, pathname) {
  const decodedPath = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
  const relativePath = normalize(decodedPath).replace(/^[/\\]+/, '');
  if (relativePath.split(/[\\/]/).some((segment) => segment.startsWith('.'))) {
    response.writeHead(404, securityHeaders());
    response.end('Not found');
    return;
  }
  const filePath = resolve(ROOT, relativePath);
  if (!filePath.startsWith(`${ROOT}\\`) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, securityHeaders());
    response.end('Not found');
    return;
  }
  response.writeHead(200, {
    ...securityHeaders(),
    'Content-Type': MIME_TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': extname(filePath) === '.html' ? 'no-cache' : 'public, max-age=604800',
  });
  createReadStream(filePath).pipe(response);
}

createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  if (url.pathname === '/api/assistant') {
    const origin = request.headers.origin || '';
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(?::\d+)?$/.test(origin)) {
      response.setHeader('Access-Control-Allow-Origin', origin);
      response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      response.setHeader('Vary', 'Origin');
    }
    if (request.method === 'OPTIONS') {
      response.writeHead(204);
      response.end();
      return;
    }
    if (request.method !== 'POST') return sendJson(response, 405, { error: 'Method not allowed' });
    if (isRateLimited(request)) return sendJson(response, 429, { error: 'Too many requests. Please try again shortly.' });
    if (!nvidiaApiKey || nvidiaApiKey === 'your-nvidia-key-here') {
      return sendJson(response, 503, { error: 'AI service is not configured.' });
    }
    try {
      const body = await readJson(request);
      const question = typeof body.question === 'string' ? body.question.trim() : '';
      if (!question || question.length > MAX_QUESTION_LENGTH) {
        return sendJson(response, 400, { error: 'Enter a question of up to 1,000 characters.' });
      }
      return sendJson(response, 200, { answer: await answerWithNvidia(question) });
    } catch {
      return sendJson(response, 502, { error: 'The AI service is temporarily unavailable.' });
    }
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, securityHeaders());
    response.end('Method not allowed');
    return;
  }
  serveStatic(response, url.pathname);
}).listen(PORT, '0.0.0.0', () => {
  console.log(`ST JUDE Autolife is running on http://localhost:${PORT}`);
});
