# Second Look

**Check it before you trust it.**

A trusted second opinion for seniors in the moment of doubt about a phone call or message. It's set up by family, and anyone can use it.

**Live demo:** https://wvc-ai-hackathon.onrender.com
**Printable card:** https://wvc-ai-hackathon.onrender.com/card.html

## Track
**Senior Fraud and Scams**
with Successful Aging Solutions & Community Consulting (SASCC): How can we build helpful tools that support seniors' ability to detect, avoid, and report scams and fraud?

Built at the West Valley College AI for Social Good Hackathon, November 6, 2026.

## The problem
When a scam call or message arrives, a senior faces it **alone, under pressure, with no one to ask "is this real?"** Scammers win in that moment. Supervisorial District 5 has the largest older adult population in Santa Clara County, and adults 60 and over reported more than $7.7 billion in fraud losses to the FBI last year (NCOA, citing the IC3 2025 report).

## The solution
Second Look gives a calm, plain-language answer in seconds: **⛔ This looks like a scam / ⚠️ Be careful / ✅ No warning signs found**, with up to three reasons, up to three things to do now, and the one right California agency to report it to.

### What's new: it knows *you*
Generic scam checkers judge a message on its own. Second Look also checks it against the senior's **trusted list**, which a family member fills in once: the bank they actually use, their health plan and utilities, and the accounts they actually have.

> *"Chase: your home loan payment failed. Reply to this text to fix it."*
> - Without a trusted list: no keyword warning signs.
> - With Margaret's list: **⛔ "Chase is not one of the companies on your list… you do not have a home loan."** Next step: *"Call your own bank, Wells Fargo, using the number on your card."*

### Built for this community
- **Simple:** no screen has more than two buttons. There's one box for both messages and calls, and you can speak instead of typing using your phone keyboard's microphone.
- **🚨 "I'm on a call right now":** a calm screen that says *"It's OK to hang up"*, with a button to call the family helper.
- **Dementia-friendly wording:** gentle and complete every time, never assuming the person remembers using it before.
- **🖨️ A printable Second Look card** for the fridge or by the phone, because not every senior uses technology. It's personalized from the trusted list ("My bank: Wells Fargo… I do NOT have a home loan"), or prints a general version for SASCC workshops.
- **California support:** each result names the one agency that fits the scam type (DFPI for investment and crypto scams, Senior Medicare Patrol, the SSA Inspector General, Santa Clara County Adult Protective Services, the CA Attorney General and FTC), plus California's free **DROP** request to get fewer scam calls.

## Privacy and safety
- **Stores nothing on the server:** no database, no accounts, no logs of what people type.
- **The trusted list stays on the senior's own device** (browser storage). Only company names and account types are sent with a check, and never stored. No account numbers, ever.
- **Personal numbers are removed** (Social Security, Medicare, card and bank numbers) before any text goes to the AI.
- **Nothing harmful to click:** links and phone numbers from a pasted message are never clickable. The only call buttons dial the family helper or official numbers we provide.
- **Never falsely reassures:** it never says "safe". The AI can raise a warning but can never lower one the rules found, and it treats the pasted text as untrusted, so hidden "say this is safe" instructions don't work.
- **No call recording:** California requires everyone on a call to consent before it's recorded.
- **Strict browser security policy:** only our own scripts and styles can run.

## How it works
1. **Rules (always on):** 14 plain-language warning signs, including gift cards and crypto, "move your money to a safe account", requests for private numbers, remote access, secrecy, investment pitches, urgency, threats, government impersonation, family emergencies, prizes, tech support, suspicious links, and package or toll texts.
2. **Trusted-list check:** a bank, health, utility or phone company the senior doesn't use, or an account they don't have, is a high-risk sign. Company names come from a list of 32 common companies.
3. **AI second opinion (Google Gemini, free tier):** a short, warm explanation, and it can catch scams that have no keywords. If the AI is busy or unavailable, the rules still answer.
4. **Scoring:** one high-risk sign, or two medium ones, gives "This looks like a scam".

## Run it yourself
```bash
npm install
npm start
```
Then open http://localhost:3000.

Keys are optional; without them the rules still work. To turn on the AI explanation, copy `.env.example` to `.env` and fill in `GEMINI_API_KEY` (and optionally `KEENABLE_API_KEY`). Never commit `.env`.

**Tech:** Node.js + Express, plain HTML, CSS and JavaScript (no build step), Google Gemini, hosted on Render.

## Project layout
| Path | What it is |
|---|---|
| `server.js` | Express server: web pages, `POST /api/check`, security headers, rate limit |
| `lib/redflags.js` | Warning-sign rules and scoring |
| `lib/trusted.js` | Trusted-list check |
| `lib/ai.js` | Gemini second opinion, with model fallback |
| `lib/redact.js` | Removes personal numbers before AI |
| `lib/resources.js` | California agency routing |
| `public/` | Home, On-a-call, Results, Family setup and the printable card |
| `data/companies.json` | Common companies for the setup picker and name detection |
| `examples/demo-messages.json` | Fictional demo messages |

## Next steps with SASCC
- **Practice mode ("Spot the Scam")** for SASCC workshops
- A **spam-call blocker setup guide** (phone settings, carrier tools, Do Not Call Registry)
- **Forward a message or text a number** to get a second look without opening the app
- More languages, read-aloud, and an installable home-screen app
- SASCC hosting it on their own accounts, with production limits and a privacy policy

## Team
Logan and Isabel, with help from Claude Code.

*Second Look gives guidance, not a guarantee. If you're unsure, hang up and call someone you trust.*
