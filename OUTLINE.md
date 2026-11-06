# Project Outline: "Is This a Scam?" (working name)

**Event:** West Valley College AI for Social Good Hackathon, Fri Nov 6, 2026
**Track:** Senior Fraud and Scams, with SASCC (Successful Aging Solutions & Community Consulting)
**Track question:** How can we build helpful tools that support seniors' ability to detect, avoid, and report scams and fraud?

---

## 1. The problem

- Adults 60+ reported more than **$7.7 billion** in fraud losses to the FBI's IC3 last year, about 37% more than the year before (NCOA, citing the IC3 2025 report).
- Scams are getting more convincing: AI voice-clone "grandparent" calls, fake Medicare cards, and government impersonators using real employee names.
- Seniors often have no quick, trusted way to ask "is this real?" in the moment. Pressure and urgency are the scammer's main weapon.
- _To add after the 10:45 panel: a real pain point or quote from SASCC._

## 2. The solution (one sentence)

A simple, large-print web tool where a senior (or a family member helping them) pastes a suspicious text, email, letter or call description. It instantly explains in plain language **whether it looks like a scam, why, and exactly what to do next**, including where to report it.

## 3. Who it's for

- **Primary:** seniors served by SASCC, who are often not confident with technology.
- **Secondary:** adult children and caregivers checking messages for a parent, and SASCC staff during workshops.

## 4. Core user flow (the demo)

1. **Paste:** a big text box, "Paste the message or describe the call."
2. **Check:** one big button.
3. **Result**, in plain language:
   - a verdict badge: 🔴 **Likely scam** / 🟡 **Be careful** / 🟢 **No warning signs found**
   - each warning sign found, explained in one sentence ("They asked for gift cards. Real companies and government agencies never ask for payment in gift cards.")
   - a **"What to do now"** checklist: don't reply, don't click, hang up and call back on a number you look up yourself, call a family member
   - a **"Report it"** section with links and phone numbers (FTC, IC3, SSA OIG, 1-800-MEDICARE, SASCC)
   - **"Others have reported this":** Keenable web results for any phone number, website or company name in the message

### Practice mode: "Spot the Scam" (the differentiator)
Checking tools like this already exist (AARP, Norton Genie, Scamio). Practice mode makes ours **preventive**: seniors build the instinct *before* a scammer calls, and SASCC can run it in workshops.
1. Show a realistic message (text, email or call script), one at a time, about 8 in total.
2. The user taps **Scam** or **Safe**.
3. Instant feedback highlights the red flags in the message, with a one-line lesson.
4. At the end: a score plus "Your top 3 things to remember."

## 5. How it works

**Approach: 3 layers, so the demo never breaks.**
1. **AI explanation (if a free key is available):** Google Gemini API free tier (no credit card). The model reads the message and returns verdict, red flags, plain-language explanation and next steps as JSON. It catches scams keywords miss.
2. **Rule-based red flags (always on):** instant, free and predictable. They're the fallback if the AI call fails or there's no key, and they also cross-check the AI.
3. **Keenable live web lookup:** what others report about a phone number, website or company in the message.

If there's no AI key, layers 2 and 3 still give a complete product.

### Red-flag rules (keyword and pattern checks, each with a plain-language explanation)
| Category | Example triggers |
|---|---|
| Unusual payment | gift card, iTunes, Google Play, wire transfer, Western Union, bitcoin, crypto, Zelle, cash courier |
| Urgency or threats | act now, immediately, within 24 hours, arrest, warrant, suspended, final notice |
| Government impersonation | IRS, Social Security, SSA, Medicare, sheriff, police + a demand |
| Personal info request | SSN, Social Security number, Medicare number, password, PIN, verify your account |
| "Move your money" | safe account, protect your money, transfer your savings |
| Family emergency | grandma, grandpa, jail, bail, accident, "don't tell mom/dad" |
| Prize or too good to be true | you've won, lottery, sweepstakes, prize, claim your reward, inheritance |
| Tech support | virus, hacked, remote access, AnyDesk, TeamViewer, Microsoft/Apple support |
| Suspicious links | URLs, shortened links (bit.ly etc.), unpaid toll, package delivery, QR code |
| Secrecy | don't tell anyone, keep this confidential |

**Scoring:** each category adds points. High-risk categories (payment, "move your money", personal info) count heavily, so 1 high-risk hit or 2 or more medium hits gives **Likely scam**, 1 medium hit gives **Be careful**, and no hits gives **No warning signs found**. That last verdict always comes with a caveat: "This doesn't guarantee it's safe."

### Keenable lookup (server-side)
- Extract phone numbers, domains and company names from the message.
- Search Keenable with a query like `"<phone/domain>" scam`, plus one general query on the scam type found.
- Show the top 3 results as "What others are saying" with title, source and link.
- Each search costs 1 credit. Limit to about 2 searches per check, and cache repeat queries during the demo.

## 6. Tech stack

- **Frontend:** plain HTML, CSS and JavaScript with no build step. Large fonts (20px+), high contrast and big buttons, mobile-friendly.
- **Backend:** Node.js 24 + Express, with a single endpoint `POST /api/check` that runs the rules and calls Keenable.
- **AI:** Gemini API free tier (`GEMINI_API_KEY`), called server-side only and optional.
- **Secrets:** `KEENABLE_API_KEY` and `GEMINI_API_KEY` stay in `.env` on the server, never in browser code, and `.env` is git-ignored.
- **Hosting:** needs a public HTTPS URL with a backend (Render, Railway or Vercel, all with free tiers). Someone on the team needs an account. Submit as `hosting_mode: external`.

### Proposed file layout
```
server.js             Express app: serves public/ and POST /api/check
lib/redflags.js       rule definitions + scoring
lib/keenable.js       Keenable search wrapper (key from env)
lib/resources.js      reporting links and phone numbers
lib/ai.js             Gemini call returning structured JSON (optional, with fallback)
data/practice.json    Practice mode scenarios + answers + lessons
public/index.html     the one-page UI (Check tab + Practice tab)
public/style.css      large-print, accessible styles
public/app.js         calls /api/check, renders results
examples/             real-looking scam messages for the demo
README.md             problem, solution, how to run, team
```

## 7. Scope

### Must have (MVP by about 1:30)
- [ ] Paste box, Check button, verdict badge
- [ ] Red-flag rules with plain-language explanations
- [ ] "What to do now" checklist and "Report it" links
- [ ] Keenable "Others have reported this" lookup
- [ ] Large-print, accessible design
- [ ] 3 to 4 example scams with one-click "Try an example" buttons, for a reliable demo
- [ ] **Practice mode** with about 8 scenarios, Scam/Safe answers, feedback and a score
- [ ] **AI explanation layer** (Gemini free tier) with rule-based fallback
- [ ] Deployed at a public URL
- [ ] README

### Nice to have (only if MVP is done)
- [ ] "Circulating now" panel: current Bay Area or senior scams via Keenable
- [ ] 🔊 "Read it to me" using the browser's built-in speech (Web Speech API, free)
- [ ] Spanish, Vietnamese or Chinese toggle (common languages in Santa Clara County)
- [ ] "Send to a family member" button that shares the result by text or email
- [ ] Family code word tip card (defeats voice-clone scams)
- [ ] Printable one-page "Scam red flags" handout for SASCC workshops

### Out of scope today
- User accounts, saving history, phone or SMS integration, reading screenshots (OCR), paid AI APIs

## 8. Team roles (Logan + Isabel)

**Split for 2 people: by feature, not by layer, so no one waits on the other.**

| | Logan (with Claude Code) | Isabel |
|---|---|---|
| **Builds** | The Checker end to end: server, red-flag rules, Gemini, Keenable, results UI, shared page shell and styles | Practice mode end to end: scenarios, quiz screen, feedback, score |
| **Owns files** | `server.js`, `lib/*`, `public/index.html`, `public/style.css`, `public/app.js`, `examples/` | `data/practice.json`, `public/practice.js`, `public/practice.css` |
| **Content** | Reporting resources (`lib/resources.js`) | About 8 practice scenarios (realistic scams and safe messages, with lessons), plus the 3 to 4 demo example scams |
| **Pitch** | Deploys the app and drives the live demo | Captures SASCC quotes at the 10:45 panel, writes the 2-minute script, makes the backup screenshots or video, presents the opening and impact |
| **Submission** | Reviews and clicks Submit | Supplies team details for the form |

**Hand-off points**
- **11:45:** Logan pushes the skeleton (page shell with a Practice tab containing an empty `<div id="practice">`), and Isabel pulls.
- **12:45:** Isabel pushes her scenarios, and Logan picks the best 3 to 4 scam messages to use as the Checker's demo examples.
- **1:30:** both merged, deployed, and testing together.
- **1:45:** code freeze, then rehearse.

**Git rules:** pull before starting, push small commits every 20 to 30 minutes, and stay in your own files. If you must touch the other person's file, tell them first.

## 9. Timeline

| Time | Goal |
|---|---|
| 10:45 | Partner panel: pitch lead captures SASCC pain points and quotes |
| 11:45 | Build starts: project skeleton, server running, UI shell |
| 12:30 | Red-flag rules working end to end, example scams loaded |
| 1:00 | Keenable lookup + Gemini AI layer wired in |
| 1:15 | Practice mode working (content person writes scenarios from 11:45) |
| 1:30 | Deployed to public URL; polish and accessibility pass |
| 1:45 | **Code freeze**: bug fixes only, rehearse the demo |
| 2:00 | README final, submission draft prepared (Logan submits) |
| 2:15 | **Demos and judging** |

## 10. Demo script (about 2 to 3 minutes)

1. **Hook (20s):** "Last year seniors lost $7.7 billion to scams..." plus the SASCC quote.
2. **Live demo (90s):**
   - Paste a fake Medicare-card text, which comes back 🔴 with its red flags, what to do, and where to report.
   - Show a grandparent voice-clone call description, which comes back 🔴 with the family code word tip.
   - Show a normal message from a pharmacy, which comes back 🟢, to show it isn't alarmist.
3. **Practice mode (30s):** "But the best defense is recognizing it *before* it happens." Play 2 rounds of Spot the Scam.
4. **How it works (20s):** an AI explanation, with rule-based red flags as a safety net, plus live web lookups through Keenable to see what others report.
5. **Impact and next steps (30s):** how SASCC could use Practice mode in workshops and the checker on their website; possible next steps are more languages and read-aloud.

**Backup:** screenshots or a screen recording in case the Wi-Fi or live site fails.

## 11. Submission checklist (Maximizing Potential)

Guide: https://mxpotential.org/submit-project.md?event=west-valley-2026-11-06&track=west-valley-sascc
Claude prepares the draft; **Logan does the final submit.**

- [ ] Title
- [ ] Summary (300 characters max)
- [ ] Description
- [ ] Team name: _needed_
- [ ] Participant names: _needed_
- [ ] Private contact email: _needed_
- [ ] Impact: _needed (use SASCC panel input; no invented evidence)_
- [ ] Repo link: https://github.com/Doctor-Frosty/wvc-ai-hackathon
- [ ] Demo link (public HTTPS)
- [ ] Optional: video link, tech used (Node, Express, Keenable)

## 12. Open questions

- [ ] Final project name?
- [ ] Will someone get a free Gemini API key (aistudio.google.com, about 2 minutes, Google account) and add it to `.env` as `GEMINI_API_KEY`?
- [ ] Who has, or will create, a hosting account (Render, Railway or Vercel)?
- [ ] Does SASCC have a phone number or website to include under "Report it" or "Get help"?
- [ ] Do the judging criteria favor any specific area (impact, technical, design, presentation)?
