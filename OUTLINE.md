# Project Outline: Second Look

**Tagline:** "Check it before you trust it."

**Event:** West Valley College AI for Social Good Hackathon, Fri Nov 6, 2026
**Track:** Senior Fraud and Scams, with SASCC (Successful Aging Solutions & Community Consulting)
**Track question:** How can we build helpful tools that support seniors' ability to detect, avoid, and report scams and fraud?

---

## 1. One problem, one solution

**Problem:** When a scam call or message arrives, a senior faces it **alone, under pressure, with no one to ask "is this real?"** Scammers win in that moment. District 5 has the largest older adult population in Santa Clara County. Adults 60+ reported more than $7.7 billion in fraud losses to the FBI last year (NCOA, citing IC3).

**Solution:** **Second Look is a trusted second opinion in the moment of doubt.** Family sets it up once, and the senior can use it any time.

**Innovation: it knows *you*.** Generic scam checkers (AARP, Norton Genie, Scamio) judge a message in isolation. Second Look checks it against **the senior's own trusted list**, which family fills in: the bank they actually use, their doctor, their utility company, and the accounts they actually have. "Your Chase home loan payment failed" is an instant ⛔ **because you don't bank with Chase and you don't have a home loan.**

**Serving the community**
- **Family:** sets it up and becomes the "call me first" contact.
- **SASCC:** introduces it in workshops and is the trusted number on every screen.
- **Seniors, including those with mild memory loss:** every answer is gentle and complete, with no memory of earlier visits needed, and the tool makes it almost impossible to accidentally do something harmful.

Every feature below must serve this one story. Anything that doesn't goes to "Next steps with SASCC".

## 2. What the panel asked for, and where we answer it

| Panel / judges said | Our answer |
|---|---|
| Protect against **phone calls, emails, investment scams** | One box for calls and messages + "On a call right now"; investment-scam red flags |
| **Ease of use, accessible** | At most two buttons per screen, large print, high contrast |
| **Limit info** | Store nothing on our server; trusted list stays on the senior's own device; personal numbers removed before AI |
| **Almost impossible to accidentally do harm** | Nothing from a pasted message is ever clickable; only trusted numbers can be called |
| **CA privacy / DROP program** | Every warning result and the family setup point to California's free DROP data-broker deletion |
| Innovation, serving the community, clear narrative | Personal trusted list; family + SASCC as the support network; one problem → one solution |
| **SASCC judge: "Not every senior is technologically adept"** | A printable, personalized **Second Look card** for the fridge or by the phone: the same advice on paper |

## 3. The screens

**Simplicity rule:** no screen has more than **two buttons**. There's one box for everything, and one thing to read at a time. When in doubt, take a button away.

### Home: one box, one button, one emergency button
- **"Hi Margaret. What happened?"** (the name comes from Family setup)
- One big box: **"Paste the message, or type what the caller said."** Seniors can use the microphone already on their phone keyboard to speak instead of typing. A privacy note sits above the box.
- Big button: **"Check it"**
- Big red button: 🚨 **"I'm on a call right now"**
- At the very bottom, a small text link: "Family setup"

Calls and messages use the **same box**: no menus, no question screens.

### 🚨 "I'm on a call right now": calm, two buttons
- **"It's OK to hang up."** Real agencies and banks never mind if you call them back.
- **Don't** give any numbers, buy gift cards, send money, or press keys they tell you to.
- **Call back** on a number *you* look up, never one they gave you.
- Button 1: **"Call Sarah"** (the first helper from Family setup; if there's none, **"Call SASCC"**)
- Button 2: **"I hung up"**, which goes back to Home so they can type what was said

### Results: the answer first, one button
1. **The answer, big:** ⛔ **This looks like a scam** / ⚠️ **Be careful** / ✅ **No warning signs found**. Never "Safe".
2. **Why**, at most 3 short sentences, including trusted-list reasons ("You don't bank with Chase.").
3. **What to do now**, at most 3 steps (for example: don't reply, don't click, call Sarah).
4. Smaller text below: **the one right place to report this kind of scam** (see "California support: one right agency" below) and the California DROP tip: "Scammers often buy your details from data brokers. One free request tells 500+ of them to delete your information: privacy.ca.gov/drop. A family member or SASCC can help."
5. One button: **"Start over"**

### 👪 Family setup: "My trusted list" (the innovation)
Filled in once by a family member on the senior's phone or tablet:
- **First name** (for the greeting)
- **Companies they really use**, picked from a list of common ones (banks, health care, utilities, phone/internet, shopping) or typed in: names only
- **Accounts they really have:** checking · savings · credit card · home loan or mortgage · car loan · investments · none of these
- **Who to call first:** one helper (name + phone) for the "Call [helper]" button
- **Checklist:** ☐ Help them file a California DROP request (free, about 10 minutes, privacy.ca.gov/drop)

**Keep it simple here too:** one scrolling page of checkboxes and short fields, one big **"Save"** button. "Use example setup" (loads a demo profile, "Margaret") and "Delete everything" are small text links at the bottom.

**Privacy:** saved **only in this device's browser**, never on our server. No account numbers, ever.

### 🖨️ The Second Look card: the offline version
Not every senior uses technology, so Second Look also works **on paper**. A one-page, large-print card to print and put on the fridge or by the phone, opened from a **"Print a card for the fridge"** link in Family setup (page: `/card.html`).
- **Before you do anything, take a second look.** Three questions:
  1. Did they **contact you** out of the blue?
  2. Are they **rushing** you, or asking you to **keep it secret**?
  3. Do they want **gift cards, crypto, a wire transfer, cash**, or your **private numbers**?
  **If yes to any: hang up. It's OK.**
- **Personalized from Family setup:** "Your bank is **Wells Fargo**. If anyone else says they're your bank, it's a scam." "You don't have a home loan." "**Call Sarah first:** (408) 555-0123."
- **Who to call:** SASCC, Senior Medicare Patrol (855) 613-7080, the CA Attorney General (800) 952-5225, and 911 if anyone is in danger. **Fewer scam calls:** privacy.ca.gov/drop.
- **Our family code word:** a blank line to write it by hand (never typed into the app).
- **No profile set up?** It prints a general version that SASCC can hand out at workshops.
- **Privacy:** built in the browser from the saved profile. Nothing is sent to the server.

### California support: one right agency per scam type
The panel asked how to include California's multi-agency fraud support. The results screen shows **only the one agency that fits the scam type** the rules detected, as plain, non-clickable text. Contacts verified 2026-11-06 via Keenable from official sites:

| Scam type | Show this | Source |
|---|---|---|
| Investment or crypto | CA Dept. of Financial Protection & Innovation (DFPI): **(866) 275-2677**, dfpi.ca.gov/submit-a-complaint | dfpi.ca.gov |
| Medicare or health | California Senior Medicare Patrol: **(855) 613-7080** | aging.ca.gov |
| Social Security | SSA Office of the Inspector General: oig.ssa.gov/report | oig.ssa.gov |
| Money already lost, or someone taking advantage of a senior | Call your bank first; then Santa Clara County Adult Protective Services, 24/7: **(408) 975-4900** or **(800) 414-2002**; and the DA Elder Fraud Unit: **(855) 323-5337** | ssa.santaclaracounty.gov · sccgov.org (DA page indexed 2018, recheck) |
| Everything else | CA Attorney General: **(800) 952-5225**, oag.ca.gov · FTC: **(877) 382-4357**, reportfraud.ftc.gov | oag.ca.gov · FTC |
| Fewer scams in future | CalPrivacy DROP: privacy.ca.gov/drop | privacy.ca.gov |

If anyone's life is in danger: **911**. These live in `lib/resources.js` (Logan), mapped from rule categories.

**Pitch line:** "Second Look doesn't just say 'scam.' It tells you the one California agency that handles this exact kind of fraud."

## 4. Non-negotiable design rules

### Privacy (top priority)
1. **Store nothing on the server:** no database, no accounts, no logs of message text.
2. **Warn before typing:** "Don't include your Social Security, Medicare, bank or card numbers."
3. **Remove personal numbers** (SSN, Medicare, card, bank account) before any text goes to Gemini. The Gemini free tier may use data to improve Google's products.
4. **The trusted list lives on the device only.** Only company names and account types are sent with a check (needed for the comparison) and never stored.
5. **Send Keenable only a phone number,** never the message.
6. **Keys stay secret:** only in `.env` or the host's settings.
7. Say it on the page: "We don't save what you share."

### No accidental harm
1. Links, phone numbers and emails from a pasted message are **never clickable**. They're shown as plain text.
2. The **only call buttons** dial numbers from the trusted list, SASCC, or official agencies we provide.
3. No sending, sharing, replying or paying from inside the tool.
4. Results are rendered as plain text (`textContent`), never HTML.

### Safety (never falsely reassure)
1. Never say "Safe". The best verdict is "No warning signs found", always with "When in doubt, call back on a number you look up yourself, or call [helper]."
2. **Rules can't be overruled:** a high-risk rule or trusted-list hit can't be downgraded by the AI.
3. The AI treats the message as untrusted text to analyze, never as instructions.
4. Footer: "This tool gives guidance, not a guarantee. If you're unsure, call [helper] or SASCC."
5. Demo guards: messages capped at about 2,000 characters, plus a simple per-visitor rate limit.

### Accessible and dementia-friendly
- Body text 20px or more, headings 32px or more, buttons 56px or taller with text labels, contrast 7:1 or better, one column, one main action per screen, works at 200% zoom.
- Never color alone: ⛔ / ⚠️ / ✅ always come with words.
- **Gentle, complete, no memory assumed:** every result explains everything from scratch; never "as before" or "remember"; warm, calm wording ("You did the right thing by checking."); no jargon or abbreviations; no time limits.
- Real `<button>` and `<label>` elements, visible focus outline, results announced to screen readers (`aria-live`).

## 5. How it works

1. **Rules (always on):** red-flag categories, each with a plain explanation: unusual payment (gift cards, crypto, wire), urgency or threats, government impersonation, personal-info requests, "move your money to a safe account", family emergency + secrecy, prize or lottery, tech support or remote access, suspicious links, and **investment scams** (guaranteed returns, "double your money", crypto opportunity, a new online friend who talks about investing).
2. **Trusted-list check:** if the message or call mentions a company not on the list, or an account type they don't have, it adds a high-risk reason ("You don't have a home loan, so a home loan problem can't be real."). Government agencies are handled by their own rule: they never demand payment or numbers by phone or text.
3. **AI explanation (Gemini free tier):** a warm, plain summary of the result. It tries `gemini-3.5-flash`, then `gemini-flash-lite-latest`, and if both fail the rules' wording is used.
4. **Number lookup (Keenable):** if the text includes a phone number, search for scam reports on just that number.

**Scoring:** a high-risk rule or trusted-list hit gives ⛔. Two or more medium hits give ⛔, one gives ⚠️, and none gives ✅ "No warning signs found".

## 6. Tech
- Node 24 + Express; plain HTML, CSS and JavaScript (no build step). Runs **without `.env`**: the AI and Keenable layers turn off and the rules still work.
- `POST /api/check`: `{ text, trusted? }` → `{ verdict, reasons[] (max 3), steps[] (max 3), explanation, lookup? }`
- Hosting: Render (free tier) at a public HTTPS URL; submitted as `hosting_mode: external`.

```
server.js              Express app + /api/check (Logan)
lib/redflags.js        rules + scoring + trusted-list check (Logan)
lib/redact.js          remove personal numbers before AI (Logan)
lib/ai.js              Gemini with model fallback (Logan)
lib/keenable.js        caller-number lookup (Logan)
lib/resources.js       report links, SASCC, DROP text (Logan)
public/index.html      all screens; app.js switches between them (Logan)
public/style.css       shared accessible design tokens (Logan)
public/app.js          Home, On-a-call, Results (Logan)
public/card.html       printable Second Look card, filled from the profile (Logan)
public/card.js         fills the card from localStorage (Logan)
public/setup.js        Family setup screen (Isabel)
public/setup.css       Family setup styles (Isabel)
data/companies.json    common companies for the setup picker + brand detection (Isabel)
```

## 7. Scope

### Build today
- [ ] Privacy, no-harm, safety and dementia-friendly rules (everything in section 4)
- [ ] Home (one box, "Check it", 🚨 button), "On a call right now", results with the DROP tip
- [ ] Family setup with "Use example setup", plus the trusted-list check
- [ ] Gemini explanation with fallback
- [ ] Printable Second Look card (personalized from Family setup)
- [ ] Keenable number lookup, demo examples, rate limit
- [x] Deployed at a public URL: https://wvc-ai-hackathon.onrender.com
- [ ] README

### Next steps with SASCC (pitch slide, not built today)
- **Practice mode** ("Spot the Scam") for SASCC workshops
- **Spam-call blocker setup guide** (phone settings, carrier tools, Do Not Call Registry) as a workshop handout
- **Forward a message or text a number** to get a second look without opening the app
- More languages, read-aloud, installable home-screen app
- SASCC hosting it on their own accounts, with production limits and a privacy policy

### Out of scope
Listening to or recording calls (California all-party consent law + "store nothing"), user accounts, a server database, reading screenshots, paid AI APIs.

## 8. Team

| | Logan (with Claude Code) | Isabel (with Claude Code) |
|---|---|---|
| **Builds** | Server, rules, trusted-list check, redaction, Gemini, Keenable, Home, On-a-call, Results, **printable card**, shared styles, deployment | **Family setup** (the innovation): setup screen, companies list, saving the trusted list, example profile, DROP checklist item, **"Print a card for the fridge" link** |
| **Pitch** | Drives the live demo | Opens with the problem and District 5, **presents the innovation** (family setup), closes with community and next steps |
| **Submission** | Reviews and clicks Submit | Supplies team details |

**Hand-offs:** 11:45 Logan pushes the skeleton · 12:15 Isabel pushes `data/companies.json` · 1:15 Isabel's setup screen saves the profile · 1:30 merged, deployed, tested together · 1:45 code freeze.

## 9. Priorities and time blocks

| Priority | What |
|---|---|
| **P0: no demo without it** | Section 4 rules · Home · On-a-call screen · check + results (with DROP) · **trusted-list check + Family setup with "Use example setup"** · deployed URL |
| **P1: makes it strong** | Gemini explanation · **printable Second Look card** (asked for by the SASCC judge) · simplicity pass |
| **P2: polish** | Rate limit · README |
| **P3: only if ahead** | Keenable number lookup · read-aloud · installable app |

**Cut line:** at **1:15**, anything in P2 or P3 not started is dropped.

### Logan
| Time | Pri | Block |
|---|---|---|
| 11:45 to 12:00 | P0 | Skeleton: server, Home / On-a-call / Results shells, shared styles, empty `#setup`. **Push** |
| 12:00 to 12:30 | P0 | Redaction + rules (with investment and call scripts) + check + results (with DROP) + On-a-call screen |
| ✅ 11:50 | P0 | **Deployed** to Render (done early) |
| 12:00 to 12:25 | P0 | Trusted-list check reading the profile |
| 12:25 to 12:50 | P1 | **Printable Second Look card** (`/card.html`) |
| 12:50 to 1:10 | P1 | Gemini explanation with fallback |
| 1:10 to 1:30 | P2/P3 | Rate limit; Keenable number lookup only if time allows |
| 1:30 to 1:45 | — | Merge, redeploy, accessibility check (200% zoom, keyboard, phone) |
| 1:45 to 2:00 | — | **Freeze.** README, rehearse |
| 2:00 to 2:15 | — | Submission draft (Logan submits), wake up the site |

### Isabel
| Time | Pri | Block |
|---|---|---|
| 11:45 to 12:15 | P0 | `data/companies.json` (about 30 common companies by category, with name variants). **Push** |
| 12:15 to 1:15 | P0 | Family setup screen: form, save/load the profile, "Use example setup", "Delete everything", DROP checklist, "Print a card for the fridge" link |
| 1:15 to 1:30 | — | Test together with Logan |
| 1:30 to 1:45 | — | Backup screenshots or screen recording |
| 1:45 to 2:15 | — | Rehearse the pitch, team details for the submission |

**2:15: Demos and judging**

## 10. Demo script (about 3 minutes, one story)

1. **Problem (25s):** "When a scam call comes, seniors face it alone, under pressure. District 5 has the largest older adult population in our county, and seniors lost $7.7 billion to scams last year." Add a SASCC line if we have one.
2. **Meet Margaret, 78 (20s):** her daughter opens **Family setup**: Wells Fargo, Kaiser, PG&E, no loans, "Call Sarah first", and the DROP checklist.
3. **The innovation (40s):** Margaret gets a text: "Chase: your home loan payment failed, verify here." Paste it and get ⛔: "You don't bank with Chase. You don't have a home loan." Point out that the link isn't clickable.
4. **The phone call (40s):** her "grandson" calls in a panic. Tap 🚨 **I'm on a call right now**: "It's OK to hang up" and **Call Sarah**. She taps **I hung up** and says into the box, "My grandson said he's in jail and needs gift cards and not to tell his mom," which gives ⛔.
5. **Point out the simplicity, and paper (20s):** "Every screen has at most two buttons. And because not every senior uses technology, Sarah prints Margaret's **Second Look card** for the fridge: her bank, who to call, the three questions." Hold up a printed card.
6. **Trust (20s):** "It stores nothing, removes personal numbers, can't be used to accidentally call or click a scammer, and helps families file California's DROP request to cut off scammers at the source."
7. **Community and next steps (25s):** family sets it up, SASCC teaches it; next come Practice mode for workshops, spam-blocker guides, and forwarding by text. Close: **"A second look, before it's too late."**

**Backup:** screenshots or a recording in case Wi-Fi or the live site fails.

## 11. Submission checklist (Maximizing Potential)

Guide: https://mxpotential.org/submit-project.md?event=west-valley-2026-11-06&track=west-valley-sascc
Claude prepares the draft; **Logan does the final submit.**

- [ ] Title: Second Look
- [ ] Summary (300 characters max)
- [ ] Description
- [x] Team name: **Second Look**
- [ ] Participant names: _needed_
- [ ] Private contact email: _needed_
- [ ] Impact: _from the panel notes and SASCC; no invented evidence_
- [ ] Repo: https://github.com/Doctor-Frosty/wvc-ai-hackathon
- [ ] Demo link (public HTTPS)
- [ ] Optional: video, tech (Node, Express, Gemini, Keenable)

## 12. Open questions
- [ ] SASCC's phone number for the "Call SASCC" button
- [ ] Hosting account (Render) created by about 12:30
- [ ] Any SASCC quote for the opening
- [ ] Is building before 11:45 allowed?
