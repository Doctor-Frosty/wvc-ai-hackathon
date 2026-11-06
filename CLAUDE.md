# CLAUDE.md: shared instructions for every Claude session on this repo

Two people build this repo at the same time, each with their own Claude Code session:
- **Logan** (`Doctor-Frosty`): the Checker, server and shared files
- **Isabel** (`isabel-aurora`, working in Antigravity): Practice mode

Read `OUTLINE.md` first. It is the plan: product, priorities (P0 to P3), time blocks and demo script.

## Project in one line
"Is This a Scam?" (working name): an accessible web app for seniors (WVC AI for Social Good Hackathon, SASCC track). The **Checker** explains whether a pasted message looks like a scam and what to do. **Practice mode** ("Spot the Scam") trains people to recognize scams before they happen.

## File ownership (most important rule)
Only edit files your person owns. If a change is needed in someone else's file, **stop and tell your person** so they can coordinate. Don't make the edit yourself.

| Owner | Files |
|---|---|
| **Logan** | `server.js`, `lib/**`, `public/index.html`, `public/style.css`, `public/app.js`, `examples/**`, `package.json`, `package-lock.json`, `README.md`, `CLAUDE.md`, `OUTLINE.md`, `.gitignore`, `.gitattributes`, `.env.example` |
| **Isabel** | `data/practice.json`, `public/practice.js`, `public/practice.css` |

New files: create them only inside your own area. Ask before adding anything elsewhere.

## Practice mode contract (how the two halves connect)
These connection points stay fixed. Don't change them without both people agreeing.

- **Mount point:** `public/index.html` (Logan) contains a Practice tab with `<section id="practice"></section>` and loads `practice.css` and `practice.js`.
- **Entry point:** `public/practice.js` defines `window.initPractice(rootElement)`. Logan's `app.js` calls it once with the `#practice` element. Practice mode renders everything inside that element and touches nothing outside it.
- **Data:** `practice.js` loads scenarios with `fetch('/data/practice.json')`. The server serves `data/` as static files.
- **Styles:** `practice.css` uses the shared CSS variables from `style.css` (`--font-body`, `--text-base`, `--color-text`, `--color-bg`, `--color-scam`, `--color-caution`, `--color-ok`, `--btn-height`, etc.). It doesn't redefine `:root` and doesn't style elements outside `#practice` (prefix every selector with `#practice`).
- **Scenario format** (`data/practice.json`):
```json
{
  "scenarios": [
    {
      "id": "medicare-card-text",
      "channel": "text",
      "from": "Medicare Services",
      "message": "MEDICARE: Your new card is on hold. Verify your Medicare number at medicare-card-update.example within 24 hrs or lose coverage.",
      "answer": "scam",
      "redFlags": ["Urgent deadline", "Asks you to verify your Medicare number", "Unofficial website (not medicare.gov)"],
      "lesson": "Medicare never texts asking you to verify your number. Your replacement card is free and comes by mail."
    }
  ]
}
```
`channel` is one of `text`, `email`, `call`, `letter`. `answer` is `scam` or `safe`. Include about 8 scenarios, at least 2 of them safe. All names, numbers and links in scenarios must be fictional.

## Non-negotiable rules for every feature
**Privacy (top priority)**
- Store nothing: no database, no saving messages, no logging message text.
- Never put API keys in browser code or git. Keys live only in `.env` (git-ignored) or the host's settings.
- Send the minimum to outside services. Redact SSN, Medicare, card and bank numbers before any AI call.

**Safety**
- Never tell a user something is "safe". Use "No warning signs found" plus advice to verify.
- Rule-based high-risk flags can't be downgraded by the AI.
- Render user or AI text with `textContent`, never `innerHTML`.

**Accessibility (seniors are the users)**
- Body text at least 20px, buttons at least 56px tall with text labels, contrast at least 7:1, one column, one main action per screen.
- Never use color alone; pair it with an icon and a word (⛔ Likely scam / ⚠️ Be careful / ✅ No warning signs found).
- Plain everyday words, no jargon, no time limits, real `<button>` and `<label>` elements, visible focus outline.

## Tech
- Node 24 + Express; plain HTML, CSS and JavaScript (no build step, no frameworks).
- Run locally: `npm install`, then `npm start`, then open http://localhost:3000
- The app **must run without `.env`**: the AI (Gemini) and Keenable layers turn off and the rule-based checker still works. Isabel doesn't need the keys.

## Git workflow (avoids clashes)
1. `git pull --rebase` **before starting** and **before every push**.
2. Commit small and often (every 20 to 30 minutes), with only your own files staged (`git add <your files>`, never `git add -A` or `git add .`).
3. Push straight to `main`. **Never** force-push, rebase shared history, or rewrite someone else's commits.
4. If a pull reports a conflict in a file you don't own, stop and tell your person. Don't resolve it on your own.
5. Never commit `.env`, `node_modules/`, or any key or token.
6. Use one AI coding agent per person at a time (in Antigravity, use Claude Code, not its built-in agent, on this repo).

## Timeline
Build 11:45 to 1:45, **code freeze at 1:45** (bug fixes only), demos at **2:15**. At 1:15, P2 and P3 work that isn't started gets dropped.
