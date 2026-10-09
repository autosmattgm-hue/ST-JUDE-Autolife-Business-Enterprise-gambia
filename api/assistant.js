const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const DEFAULT_NVIDIA_MODEL = 'z-ai/glm-5.3-flash';
const MAX_QUESTION_LENGTH = 1_000;
const WINDOW_MS = 10 * 60 * 1_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const requestsByIp = new Map();

function requestIp(request) {
  const forwarded = request.headers['x-forwarded-for'];
  return typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : 'unknown';
}

function rateLimited(request) {
  const ip = requestIp(request);
  const now = Date.now();
  const requests = (requestsByIp.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  if (requests.length >= MAX_REQUESTS_PER_WINDOW) {
    requestsByIp.set(ip, requests);
    return true;
  }
  requests.push(now);
  requestsByIp.set(ip, requests);
  return false;
}

function send(response, status, body) {
  response.status(status).setHeader('Cache-Control', 'no-store').json(body);
}

/** Vercel serverless function. NVIDIA_API_KEY stays only in Vercel Environment Variables. */
export default async function handler(request, response) {
  if (request.method !== 'POST') return send(response, 405, { error: 'Method not allowed' });
  if (rateLimited(request)) return send(response, 429, { error: 'Too many requests. Please try again shortly.' });

  const question = typeof request.body?.question === 'string' ? request.body.question.trim() : '';
  if (!question || question.length > MAX_QUESTION_LENGTH) {
    return send(response, 400, { error: 'Enter a question of up to 1,000 characters.' });
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return send(response, 503, { error: 'AI service is not configured.' });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const upstream = await fetch(NVIDIA_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.NVIDIA_MODEL || DEFAULT_NVIDIA_MODEL,
        temperature: 0.3,
        max_tokens: 450,
        stream: false,
        messages: [
          {
            role: 'system',
            content: 'You are the ST JUDE Autolife fuel-pump assistant in The Gambia. Give concise, helpful plain-English answers. Never invent prices, availability, fitment, or specifications. For exact fitment, request make, model, year, engine, and a clear old-pump or connector photo. Direct customers to confirm on WhatsApp +220 403 0870.',
          },
          { role: 'user', content: question },
        ],
      }),
    });
    if (!upstream.ok) return send(response, 502, { error: 'The AI provider is temporarily unavailable.' });
    const payload = await upstream.json();
    const answer = payload?.choices?.[0]?.message?.content?.trim();
    if (!answer) return send(response, 502, { error: 'The AI provider returned an empty reply.' });
    return send(response, 200, { answer: answer.slice(0, 2_000) });
  } catch {
    return send(response, 502, { error: 'The AI provider is temporarily unavailable.' });
  } finally {
    clearTimeout(timeout);
  }
}
