// Builds notes/manual-test-checklist.md from the two test files.
// Usage: node notes/make-checklist.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const FILES = ['test-scams.json', 'test-scams-more.json'];
const cases = FILES.flatMap((f) => JSON.parse(readFileSync(new URL(`./${f}`, import.meta.url), 'utf8')).cases).filter((c) => !c.runnerOnly);

// Cases the automatic test did not pass on the rules-only server (see test-findings-for-logan.md).
const KNOWN = new Set([
  'overpaid-refund', 'norton-renewal-refund', 'wrong-number-friend', 'legit-kaiser-appointment', 'legit-google-code',
  'call-wells-read-code', 'call-microsoft-fix', 'call-fake-lawyer-bail', 'call-pge-green-dot', 'call-door-roof',
  'email-amazon-prime-renewal', 'email-fake-invoice-geek-squad', 'es-abuela', 'zh-bank-frozen', 'format-spaced-letters',
  'format-typos', 'legit-scam-awareness', 'legit-venmo-pizza', 'legit-zelle-movie', 'legit-wells-did-you-make',
]);

const ICON = { scam: '⛔ This looks like a scam', caution: '⚠️ Be careful', ok: '✅ No warning signs found' };
const want = (c) => c.expect.map((v) => ICON[v]).join('  or  ');

const GROUPS = [
  ['Scams: government', (c) => c.type === 'government'],
  ['Scams: banks and your trusted list', (c) => ['bank', 'trusted-list'].includes(c.type)],
  ['Scams: utilities, delivery, shopping, tech support and other', (c) => ['utility', 'delivery', 'shopping', 'tech-support', 'other'].includes(c.type)],
  ['Scams: family emergency (grandparent)', (c) => c.type === 'family-emergency'],
  ['Scams: investment and romance', (c) => c.type === 'investment'],
  ['Scams: prizes, jobs, refunds and charity', (c) => ['prize', 'job', 'refund', 'charity'].includes(c.type)],
  ['Phone calls, described in the senior\'s own words', (c) => c.type === 'call'],
  ['Emails', (c) => c.id.startsWith('email-')],
  ['Other languages', (c) => c.type === 'language'],
  ['Messy, shouting, disguised or very short text', (c) => c.id.startsWith('format-')],
  ['Attempts to trick the tool', (c) => c.type === 'tool'],
  ['Real messages (should NOT be called a scam)', (c) => c.type === 'legitimate' && !c.id.startsWith('email-') && !c.id.startsWith('format-')],
];

const seen = new Set();
let n = 0;
let out = `# Manual test checklist: Second Look

All messages are **made up** (555 phone numbers, invented websites). Use them freely.
Built from \`notes/test-scams.json\` and \`notes/test-scams-more.json\` by \`node notes/make-checklist.mjs\`. The automatic version is \`node notes/run-scam-tests.mjs\`.

## Before you start
1. Open http://localhost:3000 (or the phone address).
2. Open **Family setup**, tap **Use example setup**. This saves Margaret: Wells Fargo, Kaiser Permanente, PG&E and AT&T; checking, savings and credit card; helper Sarah.
3. Cases marked **Profile: Margaret** are meant to be tried **with** that setup. Cases marked **Profile: none** are meant to be tried **without** it: in Family setup, tap **Delete everything** (twice) first, then switch back to the example when a case says Margaret. (Or use a private or second browser window for "none".)

## How to test each message
Copy the text in the box, paste it into the Home box, tap **Check it**, and compare the answer with **Expect**. Tick the box if it matches. If it doesn't, write what you saw in **Notes**.

Cases marked **(known issue)** did not give the expected answer in the automatic test, so a mismatch there is not a surprise. See \`notes/test-findings-for-logan.md\`.

Also look at every result for:
- [ ] The answer starts with an icon **and** words (never color alone)
- [ ] No more than 3 reasons and 3 steps
- [ ] Phone numbers and links from the message are **plain text, not clickable**
- [ ] The wording is gentle and makes sense with no memory of earlier visits
- [ ] Nothing says "safe"
`;

for (const [title, test] of GROUPS) {
  const list = cases.filter((c) => !seen.has(c.id) && test(c));
  if (!list.length) continue;
  out += `\n---\n\n## ${title}\n`;
  for (const c of list) {
    seen.add(c.id);
    n += 1;
    out += `\n### ${n}. ${c.id}${KNOWN.has(c.id) ? '  (known issue)' : ''}\n`;
    out += `- [ ] **Passed**  |  **Profile:** ${c.profile === 'margaret' ? 'Margaret (example setup)' : 'none'}  |  **Expect:** ${want(c)}\n`;
    out += `\n\`\`\`text\n${c.text}\n\`\`\`\n`;
    out += `\n**Notes:** \n`;
  }
}

out += `
---

## Privacy checks (personal numbers should be removed automatically)
Fictional numbers only. For each, tap **Check it**, then in the browser's developer tools (Network tab, the \`/api/check\` request) confirm the sent text shows \`[removed]\` where the number was, and that the phone number is still there.

### P1. Social Security and account number
- [ ] **Passed**

\`\`\`text
Your account 123456789012 is locked. SSN 123-45-6789. Call 408-555-0123.
\`\`\`

### P2. Card number
- [ ] **Passed**

\`\`\`text
We could not charge your card 4111 1111 1111 1111. Call 408-555-0123 to update it.
\`\`\`

### P3. Medicare number
- [ ] **Passed**

\`\`\`text
Medicare needs to confirm your number 1EG4-TE5-MK73 to keep your coverage.
\`\`\`

- [ ] The Results screen shows a gentle line saying a number was removed (only for P1 to P3)
- [ ] A message with no personal numbers does **not** show that line

## Things only the script can test
Run \`node notes/run-scam-tests.mjs\`: a message over 2,000 characters and a blank message should both be refused with a clear error and no crash. The box on the page already limits length, so these can't be typed by hand.

---

## Screens and buttons
- [ ] Home: one box, **Check it**, **I'm on a call right now**, small **Family setup** link
- [ ] On a call: **Call Sarah** (with the example setup) and **I hung up**. With setup deleted, there is no Call button for a person
- [ ] Results: ends with one **Start over** button
- [ ] Family setup: **Save** works, **Use example setup** works, **Delete everything** needs two taps
- [ ] Greeting says "Hi Margaret." after the example setup, and "Hello." after Delete everything
- [ ] Nothing in the app can send, reply or pay

## Accessibility
- [ ] Text is easy to read at the phone's largest text size and at 200% browser zoom
- [ ] Every button is easy to tap and has words on it
- [ ] Tab through each screen with the keyboard: a thick outline always shows where you are
- [ ] Works with a screen reader reading the result (VoiceOver or TalkBack)
`;
writeFileSync(new URL('./manual-test-checklist.md', import.meta.url), out);
console.log(`wrote ${n} cases`);
