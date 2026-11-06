// Second Look: server.
// Serves the web pages and one API endpoint, POST /api/check.
// Privacy: nothing the user sends is stored or logged. Only errors are logged, never message text.

import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkText } from './lib/check.js';
import { checkRateLimit } from './lib/ratelimit.js';
import QRCode from 'qrcode';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const MAX_TEXT = 2000;

app.disable('x-powered-by');
app.set('trust proxy', 1); // Render puts one proxy in front of us; needed to tell visitors apart

// Basic safety headers. The CSP only allows our own scripts and styles,
// so nothing pasted into the page can ever load or run outside code.
app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
  });
  next();
});

app.use(express.json({ limit: '20kb' }));
// Always check for a newer file, so no one sees an outdated page after we deploy.
const fresh = { setHeaders: (res) => res.set('Cache-Control', 'no-cache') };
app.use(express.static(path.join(__dirname, 'public'), fresh));
app.use('/data', express.static(path.join(__dirname, 'data'), fresh));

app.get('/healthz', (req, res) => res.json({ ok: true }));

// QR code for the printable card: points to the public site, generated here (no outside service).
const PUBLIC_URL = process.env.PUBLIC_URL || 'https://wvc-ai-hackathon.onrender.com';
let qrSvg = null;
app.get('/qr.svg', async (req, res) => {
  try {
    qrSvg ??= await QRCode.toString(PUBLIC_URL, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } });
    res.type('image/svg+xml').set('Cache-Control', 'public, max-age=86400').send(qrSvg);
  } catch (err) {
    console.error('qr failed:', err.message);
    res.status(500).end();
  }
});

app.post('/api/check', checkRateLimit, async (req, res) => {
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  if (!text) {
    return res.status(400).json({ error: 'Please paste the message, or type what the caller said.' });
  }
  if (text.length > MAX_TEXT) {
    return res.status(400).json({ error: 'That is a bit long. Please paste just the main part of the message.' });
  }
  try {
    const result = await checkText(text, req.body?.trusted);
    res.json(result);
  } catch (err) {
    console.error('check failed:', err?.message || err); // never log the user's text
    res.status(500).json({ error: 'Something went wrong on our side. When in doubt, hang up and call someone you trust.' });
  }
});

app.listen(PORT, () => {
  console.log(`Second Look running at http://localhost:${PORT}`);
  console.log(`Gemini: ${process.env.GEMINI_API_KEY ? 'on' : 'off'} | Keenable: ${process.env.KEENABLE_API_KEY ? 'on' : 'off'}`);
});
