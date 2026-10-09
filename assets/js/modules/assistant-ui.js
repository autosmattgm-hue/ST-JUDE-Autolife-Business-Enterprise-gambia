/**
 * Floating AI chat panel: asks the pump expert, shows quick replies,
 * opens WhatsApp deep actions, stores optional NVIDIA key locally.
 */
import { h } from '../lib/dom.js';
import { SITE, buildWhatsAppLink } from '../config.js';
import { answerQuestion } from './assistant.js';

const QUICK = ['Which pump for my Corolla?', 'Benz W124 pump?', 'Car cuts out', 'Price?'];

export function initAssistant() {
  const root = document.getElementById('assistant');
  if (!root) return;
  const log = root.querySelector('#assistant-log');
  const form = root.querySelector('#assistant-form');
  const input = root.querySelector('#assistant-input');
  const toggle = document.getElementById('assistant-toggle');
  const closeBtn = root.querySelector('#assistant-close');
  let busy = false;

  function setOpen(open) {
    root.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  }

  function bubble(role, text, links = []) {
    const item = h('div', { class: `chat-msg chat-${role}` });
    const p = h('p', {}, text);
    item.append(p);
    if (links.length > 0) {
      const row = h('div', { class: 'chat-links' });
      links.forEach((link) => {
        const external = link.href.startsWith('http');
        row.append(h('a', {
          class: 'btn btn-line btn-sm', href: link.href,
          target: external ? '_blank' : undefined,
          rel: external ? 'noopener noreferrer' : undefined,
        }, link.label));
      });
      item.append(row);
    }
    log.append(item);
    log.scrollTop = log.scrollHeight;
    return item;
  }

  function quickRow() {
    const row = h('div', { class: 'chat-quick' });
    QUICK.forEach((q) => row.append(h('button', { type: 'button', class: 'chip', onclick: () => ask(q) }, q)));
    log.append(row);
    log.scrollTop = log.scrollHeight;
  }

  async function ask(text) {
    const question = text.trim();
    if (!question || busy) return;
    busy = true;
    bubble('user', question);
    input.value = '';
    const thinking = bubble('bot', 'Checking pumps…');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const answer = await answerQuestion(question, { signal: controller.signal });
      thinking.querySelector('p').textContent = answer.text;
      const oldLinks = thinking.querySelector('.chat-links');
      if (oldLinks) oldLinks.remove();
      if (answer.links?.length > 0) {
        const row = h('div', { class: 'chat-links' });
        answer.links.forEach((link) => {
          const external = link.href.startsWith('http');
          row.append(h('a', {
            class: 'btn btn-line btn-sm', href: link.href,
            target: external ? '_blank' : undefined,
            rel: external ? 'noopener noreferrer' : undefined,
          }, link.label));
        });
        thinking.append(row);
      }
    } catch {
      thinking.querySelector('p').textContent = `Sorry, I had trouble. WhatsApp ${SITE.phoneDisplay} and we will help directly.`;
      thinking.append(h('div', { class: 'chat-links' }, h('a', {
        class: 'btn btn-wa btn-sm', href: buildWhatsAppLink(`Hello ${SITE.name}, I need help: ${question.slice(0, 120)}`),
        target: '_blank', rel: 'noopener noreferrer',
      }, 'WhatsApp us')));
    } finally {
      clearTimeout(timeout);
      busy = false;
      log.scrollTop = log.scrollHeight;
    }
  }

  toggle.addEventListener('click', () => setOpen(root.hidden));
  closeBtn.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !root.hidden) setOpen(false);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    ask(input.value);
  });
  const navAssistant = document.getElementById('nav-assistant');
  if (navAssistant) navAssistant.addEventListener('click', () => setOpen(true));

  bubble('bot', `Hello! Ask me which pump fits your car, e.g. "Corolla" or "Benz W124". Prices are confirmed on WhatsApp at ${SITE.phoneDisplay}.`);
  quickRow();
}
