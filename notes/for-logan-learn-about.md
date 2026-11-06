# Request for Logan (and Logan's Claude session): a "Learn about Second Look" flow

From: Isabel (`isabel-aurora`). Written by Isabel's Claude session.
Why this file is in `notes/`: Isabel may only edit her own files. Every change below is in Logan's files (`public/index.html`, `public/app.js`, `public/style.css`), so **nothing here has been applied**. Logan decides.

## For Logan's Claude agent
Read this whole file. **Ask Logan to confirm before editing anything.** If he says yes, build it, test it, and commit only the files you edited. Final copy is below, so you don't need to write any of the wording.

## The request
A small link at the top of Home, **"Learn about Second Look"**, that opens a three-screen flow:

1. **Choice screen:** "Who is reading this?" with two buttons: **I'm using Second Look** and **I'm helping a family member**.
2. **For the person using it:** as short and simple as possible (big text, a few lines).
3. **For the family member:** a bit more detail: what it is, how to set it up, why the trusted list matters, privacy, what it won't do.

Goal: someone seeing the tool for the first time (a senior, a family member, a judge or a SASCC worker) understands it in under a minute, with no jargon.

## Where it goes
- Put a small text link at the very top of Home, with the app name and tagline: **"Learn about Second Look"** (the header already has "👪 Family setup", so keep this one visually lighter, or put it under the tagline). Do not make it a big button: Home already has the red call button and Check it.
- Screens and hashes, following the existing pattern in `app.js`: `about` (`#about`), `about-user` (`#about-user`), `about-family` (`#about-family`). Add them to the `screens` array, and update the `hashchange` handler, which today only recognizes `#setup`. The browser's Back button must work.

## Rules (from CLAUDE.md)
- **At most two buttons per screen.** Choice screen: the two choice buttons, and the way back as a plain text link ("Back to start"). User screen: one button. Family screen: two buttons.
- Body text 20px or more, buttons 56px or taller with words on them, 7:1 contrast, one column, real `<button>` and `<a>`, visible focus, focus moves to the `<h1>` (`tabindex="-1"`) on each screen.
- Never say "safe". Gentle, complete wording that assumes no memory of earlier visits. No jargon, no abbreviations, no time limits.
- Render everything with `textContent`, never `innerHTML` (if the text is fixed in `index.html`, that's fine).

## Screen 1: choice (`#about`)
- **h1:** Learn about Second Look
- **Line:** Who is reading this?
- **Button 1:** I'm using Second Look  → `#about-user`
- **Button 2:** I'm helping a family member  → `#about-family`
- **Text link:** Back to start

## Screen 2: for the person using it (`#about-user`), as simple as possible
- **h1:** Second Look is here to help you
- **Line (large):** Not sure if a call or a message is real? Ask Second Look.
- **Numbered steps:**
  1. Paste the message, or type what the caller said.
  2. Tap **Check it**.
  3. We tell you what we think, and what to do next.
- **Line:** On the phone with someone who is scaring you? Tap the red button. It's OK to hang up.
- **Line:** We don't save what you share.
- **Line:** Second Look gives advice, not a promise. If you are still not sure, call **[helper name]**.
  - Fill the name from the saved profile (`profile.helper.name`) with `textContent`. If there is no helper, say "call someone you trust".
  - It is plain text. Do not make it a phone link here.
- **One button:** Back to start  → `#home`

## Screen 3: for the family member (`#about-family`)
- **h1:** For family members
- **h2:** What Second Look is
  A trusted second opinion for a parent or grandparent who gets a suspicious call, text or email. They paste in the message, or type what the caller said, and Second Look says whether it looks like a scam and what to do next.
- **h2:** Why set it up for them
  You fill in what they really use: their banks, their doctor, their utilities, and the accounts they have. Then Second Look can tell right away when a message does not fit. For example, "Chase: your home loan payment failed" is flagged because they do not bank with Chase and have no home loan.
- **h2:** How to set it up (about five minutes)
  1. Open Family setup on their phone or tablet.
  2. Tick the companies and accounts they really have. Add one person to call first, like you.
  3. Tap **Save**.
  (Want to look around first? Tap **Use example setup** on that page.)
- **h2:** Privacy
  Everything you fill in stays on that device. We don't keep a copy and we don't save what they check. We never ask for account numbers. We remove personal numbers we recognize, like Social Security and bank numbers, before checking.
- **h2:** What it will not do
  It never listens to or records calls. It never makes a link or a number from a message tappable, and it cannot send, reply or pay. The only call buttons dial the helper you chose, SASCC, or official numbers we provide. It gives guidance, not a guarantee, so the answer is never "safe". The best answer is "No warning signs found".
- **h2:** Good to know
  - There is a printable card for people who don't use a phone or tablet.
  - California's free DROP request asks over 500 data brokers to delete your relative's information, which means fewer scam calls. It takes about 10 minutes at privacy.ca.gov/drop. Setup has a checklist item for it.
  - SASCC (Successful Aging Solutions & Community Consulting) can help with questions.
  (Make `privacy.ca.gov/drop` plain text here, like on Results. Link the printable card to `/card.html`, which Home already links to.)
- **Button 1 (primary):** Open Family setup  → `#setup`
- **Button 2:** Back to start  → `#home`

## Notes on the wording
- It reuses claims already on the page and in `README.md`. If any of those change (for example the DROP numbers or what the AI sees), change them here too.
- "Never listens to or records calls" matches the out-of-scope line in OUTLINE.md.
- Keep the user screen short. If it ever needs a scroll, cut a line, don't shrink the text.

## How to check it works
1. From Home, tap **Learn about Second Look**, then each choice, then Back, with the mouse, the keyboard only, and the browser's Back button.
2. Check the focus lands on each screen's heading, and the outline is visible.
3. At 200% zoom and a phone-sized window: nothing cut off, no sideways scroll.
4. Count the buttons on each screen: choice 2, user 1, family 2.
5. With the example setup saved, the user screen names "Sarah". With the profile deleted, it says "call someone you trust".

## Docs to update after (Logan's files)
- `OUTLINE.md`, section 3 (screens): add the About flow, and mention it in the demo script if used.
- `CLAUDE.md`, the "Screens" line, if Logan wants the list kept current.
- `README.md`: the screens list.

## Priority
This is polish (P2): it makes first contact clearer and helps the pitch ("anyone can understand it in under a minute"). It doesn't touch the check itself, so it shouldn't affect the demo flow. If time is short, put it on the Next Steps page.
