# Second Look: developer guide

How the app is built, how to run and test it, and how to change it safely.
For what the product does and why, see the [README](../README.md) and [OUTLINE.md](../OUTLINE.md).

## Quick start

```bash
npm install
npm start          # http://localhost:3000
```

Keys are optional. Copy `.env.example` to `.env` (UTF-8, one `NAME=value` per line) to turn on:

| Variable | What it turns on | Without it |
|---|---|---|
| `GEMINI_API_KEY` | AI explanation and second opinion (Google Gemini) | Rules-only answers |
| `KEENABLE_API_KEY` | Live lookup of phone numbers found in a message ("What others report") | No lookup section |
| `PUBLIC_URL` | URL encoded in the QR code | `https://wvc-ai-hackathon.onrender.com` |
| `RATE_LIMIT=off` | Disables the per-visitor limit, **for local test runs only** | 60 checks per 5 minutes per visitor |
| `PORT` | Server port | `3000` |

Never commit `.env` (it is git-ignored). On startup the server prints whether Gemini and Keenable are on.

## Architecture

```
Browser (public/)                              Server (server.js + lib/)
─────────────────                              ─────────────────────────
Home: one box ──► redact numbers in browser ──► POST /api/check
                  (app.js)                       │ rate limit (lib/ratelimit.js)
                  + trusted list names/types     │ length check (2,000 chars)
                    from localStorage            ▼
                                                 lib/check.js
                                                 ├─ lib/trusted.js   trusted-list flags (first)
                                                 ├─ lib/redflags.js  warning-sign rules → verdict
                                                 ├─ lib/ai.js        Gemini: explanation + second opinion
                                                 │    (lib/redact.js runs again before the call)
                                                 ├─ lib/keenable.js  web reports about a phone number (in parallel with AI)
                                                 └─ lib/resources.js one right agency for this scam type
Results ◄──────── { verdict, headline, reasons[≤3], steps[≤3], report, explanation, flags, ai }
```

Nothing is stored server-side. Server logs contain errors only, never message text.

### Verdict logic
1. **Rules** (`lib/redflags.js`) return matching flags, each `high` or `medium`.
2. **Trusted list** (`lib/trusted.js`) adds flags for companies the senior doesn't use (high for bank, health, utility and phone companies; medium otherwise) and accounts they don't have (high).
3. **Score** (`scoreFlags`): any high, or two or more medium, gives `scam`; one medium gives `caution`; none gives `ok`.
4. **AI** (`lib/ai.js`) may **raise** the verdict by one level, or fully when the text is mostly not English (the rules can't read it). It can **never lower** it.
5. Results show trusted-list reasons first, then the most serious rule reasons.

## Files and owners

Ownership avoids clashes between the two people building in parallel. See [CLAUDE.md](../CLAUDE.md) for the full rules.

| Path | Purpose | Owner |
|---|---|---|
| `server.js` | Express app: static files (no-cache), `/api/check`, `/qr.svg`, `/healthz`, security headers | Logan |
| `lib/check.js` | Runs all layers and builds the result | Logan |
| `lib/redflags.js` | Warning-sign rules and scoring | Logan |
| `lib/trusted.js` | Trusted-list check (reads `data/companies.json`) | Logan |
| `lib/ai.js` | Gemini call, model fallback, language handling, output cleanup | Logan |
| `lib/redact.js` | Server-side removal of personal numbers; phone-number finder | Logan |
| `lib/resources.js` | Agency routing text, SASCC contact | Logan |
| `lib/keenable.js` | Phone-number lookup (number only, 4.5s timeout, 1-hour cache, .gov numbers treated as official) | Logan |
| `lib/ratelimit.js` | In-memory per-visitor limit (hashed IP) | Logan |
| `public/index.html`, `app.js`, `style.css` | Home, On-a-call, Results screens; shared design tokens | Logan |
| `public/card.*` | Printable Second Look card (`/card.html`) | Logan |
| `public/next.*` | Next Steps page for the presentation (`/next.html`) | Logan |
| `public/setup.js`, `setup.css` | Family setup screen | Isabel |
| `data/companies.json` | Companies for the setup picker and name detection | Isabel |
| `notes/` | Panel notes, requests, test suites | Isabel |

## Contracts between the two halves

**Family setup** renders inside `<section id="setup">` via `window.initSetup(rootElement)` and saves to `localStorage` key `secondlook.profile`:

```json
{
  "firstName": "Margaret",
  "companies": ["Wells Fargo", "Kaiser Permanente", "PG&E", "AT&T"],
  "accounts": ["checking", "savings", "credit card"],
  "helper": { "name": "Sarah", "phone": "+14085550123" },
  "dropDone": false
}
```

`accounts` values: `checking`, `savings`, `credit card`, `home loan`, `car loan`, `investments`. After saving, setup calls `window.SecondLook.refreshProfile()` so Home updates.

**Companies list** (`data/companies.json`): `{ "companies": [{ "name", "category", "aliases": [] }] }`, with `category` one of `bank`, `health`, `utility`, `phone`, `shopping`, `delivery`, `tech`.

## Rules: adding or changing one

Each rule in `lib/redflags.js`:

```js
{
  id: 'payment',            // shown in results.flags and test output
  severity: 'high',         // 'high' alone means scam; 'medium' needs two
  topic: 'general',         // picks the agency: general | money | investment | government
  patterns: [/regex/i],     // any match triggers the rule
  test: (text) => boolean,  // optional, for logic regexes can't express
  reason: '…',              // one plain sentence, complete on its own
  step: '…',                // one thing to do now
}
```

Writing guidelines:
- **Reasons are read by seniors, some with memory loss.** Plain words, complete sentences, no "as before", never "safe".
- **Prefer precision over reach.** A false alarm on a real message from family or a doctor hurts trust more than a missed scam the AI may still catch.
- Single ordinary words need context. For example, family words only count next to trouble words, and "verify" only counts when it's about *your* details.
- Scam-awareness notices ("scammers may pretend to be Medicare… never give your SSN") don't trigger the `personal_info` or `government` rules unless they also ask for something.
- Spaced-out letters ("G i f t  c a r d s") are joined before matching.

## Testing

Run these after any change to rules, the trusted list or the AI layer.

**1. Full suite (84 fictional messages, Isabel's):**

```bash
PORT=3999 RATE_LIMIT=off GEMINI_API_KEY= KEENABLE_API_KEY= node server.js &
BASE=http://localhost:3999 node notes/run-scam-tests.mjs
```

Expect `84 of 84 passed` with rules only. The empty `GEMINI_API_KEY=` keeps the run free and repeatable.

**2. Demo messages:** `examples/demo-messages.json` holds the six live-demo inputs with expected verdicts. All must pass.

**3. In the browser:** keyboard-only (Tab, type, Tab, Enter; focus should land on the verdict), phone width (375px, no sideways scrolling), and 200% zoom.

**4. Printable card:** each page must fit letter size at about 18pt body text. Printed on two pages, double-sided.

## Security notes
- **Content Security Policy:** only our own scripts and styles run. No inline `<script>`, no `onclick=`, no `style=` attributes, no outside CDNs. Setting `element.style.x` from JS is fine.
- **Render text with `textContent`, never `innerHTML`.**
- **Never link to anything taken from a pasted message.** Only verified numbers become `tel:` links.
- **Personal numbers** are removed in the browser (`app.js`) and again on the server (`lib/redact.js`). Phone numbers are kept on purpose.
- **Keys** live only in `.env` locally and in Render's environment settings.

## Deployment
- Hosted on **Render** (free web service) from `main`: build `npm install`, start `npm start`, health check `/healthz`.
- **Every push to `main` redeploys** in about two minutes.
- Free instances sleep when idle, so open the site a few minutes before a demo.
- Set `GEMINI_API_KEY` (and optionally `KEENABLE_API_KEY`) in Render's **Environment** settings. Never set `RATE_LIMIT=off` there.

## Git workflow
1. `git pull --rebase` before starting and before every push (`git config pull.rebase true` makes it the default).
2. Stage only your own files (`git add <files>`, never `git add -A`).
3. Push to `main`. Never force-push.
4. A conflict in someone else's file: stop and tell them.

## Regenerating assets
- **App icons:** `node scripts/make-icons.mjs` writes `public/icons/icon-{180,192,512}.png`.
- **QR code:** generated on request at `/qr.svg` from `PUBLIC_URL`, cached in memory.
