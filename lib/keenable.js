// Keenable lookup: "What do other people report about this phone number?"
// Privacy: only the phone number is sent, never the message. Results are shown as plain
// text (title and website name), never as links, to keep the no-accidental-harm rule.
// It never blocks a check: a slow or failed lookup is simply skipped.

import { findPhoneNumbers } from './redact.js';

const ENDPOINT = 'https://api.keenable.ai/v1/search';
const TIMEOUT_MS = 4500;
const CACHE_MS = 60 * 60 * 1000;
const cache = new Map(); // number -> { at, value }

export const keenableEnabled = () => Boolean(process.env.KEENABLE_API_KEY);

const pretty = (d) => `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
const SCAM_WORDS = /\b(scam|scammer|fraud|fraudulent|spam|robocall|phishing|fake|impersonat\w*|reported)\b/i;

// Fictional demo numbers (555-01xx) are never looked up.
const isFictional = (d) => /^\d{3}55501\d\d$/.test(d);

async function search(query, key) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': key, 'X-Keenable-Title': 'second-look' },
    body: JSON.stringify({ query, max_results: 5 }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`keenable HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.results) ? data.results : [];
}

function siteName(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

// Returns null, or { number, reports: [{ title, site }], scamReports: n }.
export async function lookupNumber(text) {
  const key = process.env.KEENABLE_API_KEY;
  if (!key) return null;
  const digits = findPhoneNumbers(text).find((d) => !isFictional(d));
  if (!digits) return null;

  const hit = cache.get(digits);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.value;

  try {
    const results = await search(`"${pretty(digits)}" OR "${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}" phone number scam reports`, key);
    // Only results that actually mention this number count.
    const tail = digits.slice(3); // e.g. 5550199
    const mentions = results.filter((r) => {
      const blob = `${r.title || ''} ${r.snippet || ''}`.replace(/\D/g, '');
      return blob.includes(tail);
    });
    // Official government pages that list the number mean it's a real agency number
    // (scammers often spoof those, but the number itself is not the scam).
    const isOfficial = (r) => /\.(gov|mil)$/i.test(siteName(r.url)) || /\.(ca|state)\.us$/i.test(siteName(r.url));
    const official = mentions.some(isOfficial);
    // Scam reports: other sites whose *title* calls this number a scam, spam or fraud.
    const scamReports = official ? 0 : mentions.filter((r) => !isOfficial(r) && SCAM_WORDS.test(String(r.title || ''))).length;
    const value = {
      number: pretty(digits),
      official,
      reports: mentions.slice(0, 3).map((r) => ({
        title: String(r.title || '').replace(/\s+/g, ' ').trim().slice(0, 90),
        site: siteName(r.url),
      })),
      scamReports,
    };
    cache.set(digits, { at: Date.now(), value });
    return value;
  } catch (err) {
    console.error('keenable:', err.message); // never logs the user's text
    return null;
  }
}
