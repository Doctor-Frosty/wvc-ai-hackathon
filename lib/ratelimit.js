// A small in-memory limit on checks per visitor, to protect the free AI and search
// credits during the demo. Visitors are tracked only by a one-way hash of their IP,
// held in memory for a few minutes and never written anywhere.

import { createHash } from 'node:crypto';

const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
// Generous on purpose: everyone on the venue Wi-Fi may share one IP address.
const MAX_CHECKS = 60; // per visitor per window
const hits = new Map(); // hashed ip -> array of timestamps

const keyFor = (ip) => createHash('sha256').update(String(ip)).digest('hex').slice(0, 16);

export function checkRateLimit(req, res, next) {
  // For local test runs only (e.g. notes/run-scam-tests.mjs sends 80+ checks). Never set on Render.
  if (process.env.RATE_LIMIT === 'off') return next();
  const now = Date.now();
  const key = keyFor(req.ip);
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_CHECKS) {
    const waitMin = Math.ceil((WINDOW_MS - (now - recent[0])) / 60000);
    res.set('Retry-After', String(waitMin * 60));
    return res.status(429).json({
      error: `You've checked a lot of messages in a short time. Please wait about ${waitMin} minute${waitMin === 1 ? '' : 's'} and try again.`,
    });
  }
  recent.push(now);
  hits.set(key, recent);
  next();
}

// Forget old visitors every few minutes so memory stays small.
setInterval(() => {
  const now = Date.now();
  for (const [key, times] of hits) {
    if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
}, WINDOW_MS).unref();
