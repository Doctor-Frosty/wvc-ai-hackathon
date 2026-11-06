# CLAUDE.md: shared instructions for every Claude session on this repo

Two people build this repo at the same time, each with their own Claude Code session:
- **Logan** (`Doctor-Frosty`): server, checker, Home / On-a-call / Results screens, shared files
- **Isabel** (`isabel-aurora`, working in Antigravity): **Family setup** (the trusted list)

Read `OUTLINE.md` first. It is the plan: the one-line narrative, screens, rules, priorities (P0 to P3), time blocks and demo script.

## The product in one line
**Second Look** ("Check it before you trust it."): a trusted second opinion for seniors in the moment of doubt. It's set up by family, and it **knows the senior's own banks and accounts**, so a scam about an account they don't have is caught instantly. (WVC AI for Social Good Hackathon, SASCC track.)

**Simplicity rule:** no screen has more than **two buttons**. There's one box for both calls and messages, and one thing to read at a time. When in doubt, take a button away.

Screens: **Home** (one box, "Check it", 🚨 "I'm on a call right now", small "Family setup" link) → **Results** (answer, up to 3 reasons, up to 3 steps, "Start over") · **On a call right now** ("Call [helper]", "I hung up") · **Family setup** (Isabel) · **Printable Second Look card** (`/card.html`, Logan), for seniors who don't use technology.

Live site: https://wvc-ai-hackathon.onrender.com (redeploys on every push to `main`).

The app never listens to or records calls (California all-party consent law + "store nothing").

## File ownership (most important rule)
Only edit files your person owns. If a change is needed in someone else's file, **stop and tell your person**. Don't make the edit yourself.

| Owner | Files |
|---|---|
| **Logan** | `server.js`, `lib/**`, `public/index.html`, `public/style.css`, `public/app.js`, `public/card.html`, `public/card.js`, `public/card.css`, `public/about.html`, `public/about.css`, `public/next.html`, `public/next.css`, `examples/**`, `package.json`, `package-lock.json`, `README.md`, `CLAUDE.md`, `OUTLINE.md`, `.gitignore`, `.gitattributes`, `.env.example` |
| **Isabel** | `public/setup.js`, `public/setup.css`, `data/companies.json`, `notes/**`, `panel-notes.md` |

New files: create them only inside your own area. Ask before adding anything elsewhere.

## Family setup contract (how the two halves connect)
These connection points stay fixed. Don't change them without both people agreeing.

- **Mount point:** `public/index.html` (Logan) has `<section id="setup"></section>`, reached from the "Family setup" link on Home, and loads `setup.css` and `setup.js`. Logan's code shows and hides screens and provides "Back" outside `#setup`.
- **Entry point:** `public/setup.js` defines `window.initSetup(rootElement)`. Logan's `app.js` calls it once. Setup renders only inside `#setup`.
- **Saved profile:** setup saves to `localStorage` key **`secondlook.profile`** (wrap every read and write in try/catch). Logan's `app.js` reads it. Exact shape:
```json
{
  "firstName": "Margaret",
  "companies": ["Wells Fargo", "Kaiser Permanente", "PG&E", "AT&T"],
  "accounts": ["checking", "savings", "credit card"],
  "helper": { "name": "Sarah", "phone": "+14085550123" },
  "dropDone": false
}
```
`accounts` values come only from: `checking`, `savings`, `credit card`, `home loan`, `car loan`, `investments`. An empty list means "none of these".
- **"Use example setup"** saves exactly the Margaret profile above (with a fictional 555 number). **"Delete everything"** removes the key.
- **Companies list** (`data/companies.json`, Isabel): used by the setup picker *and* by Logan's server to spot company names in messages. Shape:
```json
{
  "companies": [
    { "name": "Chase", "category": "bank", "aliases": ["JPMorgan Chase", "Chase Bank"] },
    { "name": "Kaiser Permanente", "category": "health", "aliases": ["Kaiser"] }
  ]
}
```
`category` is one of `bank`, `health`, `utility`, `phone`, `shopping`, `delivery`, `tech`. About 30 common companies, including the big banks, Kaiser, PG&E, Comcast/Xfinity, AT&T, Verizon, T-Mobile, Amazon, Apple, Microsoft, PayPal, USPS, UPS and FedEx. Government agencies (IRS, Social Security, Medicare) are **not** in this list; Logan's rules handle them.
- **Styles:** `setup.css` uses the shared CSS variables from `style.css` (`--text-base`, `--color-text`, `--color-bg`, `--btn-height`, etc.), never redefines `:root`, and prefixes every selector with `#setup`.
- **Setup screen layout:** one scrolling page, one big **Save** button; "Use example setup", "Delete everything" and **"Print a card for the fridge"** are small text links. It's for the family member, but it follows the same accessibility rules.
- **Print link:** "Print a card for the fridge" is a plain link to **`/card.html`** (Logan's page, opens in the same tab). That page reads the same `secondlook.profile` from `localStorage` and lays out the printable card. Setup only needs the link.

## Non-negotiable rules for every feature
**Privacy (top priority)**
- Store nothing on the server: no database, no saving messages, no logging message text.
- The profile stays on the device (`localStorage`). Only company names and account types are sent with a check, and they're never stored. No account numbers, ever.
- Never put API keys in browser code or git. Keys live only in `.env` (git-ignored) or the host's settings.
- Remove SSN, Medicare, card and bank numbers before any AI call. Send Keenable only a phone number.

**No accidental harm**
- Links, phone numbers and emails from a pasted message are **never clickable**; show them as plain text.
- The only call buttons dial the helper from the profile, SASCC, or official numbers we provide.
- No sending, sharing, replying or paying from inside the tool. Render user and AI text with `textContent`, never `innerHTML`.

**Safety**
- Never say "safe". Use "No warning signs found" plus advice to verify.
- Rule-based or trusted-list high-risk flags can't be downgraded by the AI.

**Accessible and dementia-friendly**
- Body text at least 20px, buttons at least 56px tall with text labels, contrast at least 7:1, one column, **at most two buttons per screen**.
- Never color alone: ⛔ This looks like a scam / ⚠️ Be careful / ✅ No warning signs found.
- Gentle, complete wording that assumes no memory of earlier visits; no jargon, abbreviations or time limits; real `<button>`/`<label>`; visible focus outline.

## Tech
- Node 24 + Express; plain HTML, CSS and JavaScript (no build step, no frameworks).
- Run locally: `npm install`, then `npm start`, then open http://localhost:3000
- The app **must run without `.env`**: Gemini and Keenable turn off and the rules still work. Isabel doesn't need the keys.
- **Strict Content Security Policy (set in `server.js`):** only our own `.js` and `.css` files can run. So: **no inline `<script>`**, **no `onclick="..."`** or other inline event attributes (use `addEventListener`), **no `style="..."` attributes** or `<style>` tags (put styles in your `.css` file; setting `element.style.x` from JS is fine), and no outside CDNs. Anything inline is silently blocked by the browser (you'll see a CSP error in the console).

## Git workflow (avoids clashes)
1. `git pull --rebase` **before starting** and **before every push** (or set `git config pull.rebase true` once).
2. Commit small and often (every 20 to 30 minutes), staging only your own files (`git add <your files>`, never `git add -A` or `git add .`).
3. Push straight to `main`. **Never** force-push or rewrite pushed commits.
4. If a pull reports a conflict in a file you don't own, stop and tell your person.
5. Never commit `.env`, `node_modules/`, or any key or token.
6. One AI coding agent per person at a time (in Antigravity, use Claude Code, not its built-in agent, on this repo).

## Timeline
Build 11:45 to 1:45, **code freeze at 1:45** (bug fixes only), demos at **2:15**. At 1:15, P2 and P3 work that isn't started gets dropped.
