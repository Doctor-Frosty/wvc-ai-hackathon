# Request for Logan (and Logan's Claude Code session): automatic removal of personal numbers

From: Isabel (`isabel-aurora`). Written by Isabel's Claude session.
Why this file is in `notes/`: Isabel may only edit her own files. Every change below is in Logan's files, so **nothing here has been applied**. Logan decides.

## For Logan's Claude agent
Read this whole file. Then **ask Logan to confirm** before editing anything. If he says yes, do the tasks below, test them, and commit only the files listed.

## The request
Make the privacy step **automatic**, so the senior has less to do. Today the Home screen asks them to leave out their Social Security, Medicare, bank and card numbers (`public/index.html`, the `<p class="note" id="privacy-note">` block, about lines 26 to 29). Instead, remove those numbers automatically, **in the browser, before anything is sent**, and tell the senior gently when it happened.

Goal: the easiest possible experience. No rules for the senior to remember.

## Tasks

### 1. `public/app.js`: redact in the browser before sending
- In `runCheck` (about line 168), run the text through a browser copy of the patterns in `lib/redact.js` **before** the `fetch('/api/check', ...)` call. Send the redacted text, not the original.
- Reuse the same four patterns (SSN, Medicare, card, long account number) and keep the same "keep phone numbers" rule. Replace each match with `[removed]`.
- Count the removals. Pass the count to the Results screen (for example, a `removed` value that `showResult` receives alongside the server's result, since the server will now see `[removed]` already).
- Keep `lib/redact.js` and its use in `lib/ai.js` exactly as they are. It is the safety net.
- Do not put the original text anywhere else: no logging, no storage.
- Render everything with `textContent`, never `innerHTML` (project rule).

### 2. `public/index.html`: replace the warning with reassurance
Replace the note text with something like:
> We remove personal numbers automatically. We don't save what you share.

Keep `id="privacy-note"` so `aria-describedby` still works. Keep it at least 20px and 7:1 contrast (the `.note` class already does).

### 3. Gentle feedback on Results
If one or more numbers were removed, show one short line on the Results screen, for example:
> We removed a number from your message to protect you.
- Add the line in `index.html` as a hidden element and fill it in `app.js` with `textContent`.
- This must not add a button. The simplicity rule still applies: at most two buttons per screen.
- No jargon, and it must read well with no memory of earlier visits.

### 4. Wording must not over-promise
The patterns can miss things, such as numbers spelled out in words or unusual formats. So never say "all" or "everything". Use "personal numbers we recognize" anywhere this is described, including the pitch and README. Never say "safe".

### 5. Docs (Logan's files, update after the code works)
- `OUTLINE.md`: Privacy rule 2 ("Warn before typing") becomes "Remove personal numbers automatically, in the browser, before sending". Also the "Limit info" row in section 2, and the demo script's trust line (about 20 seconds in step 6) if it mentions warnings.
- `README.md`: the same wording change.
- `CLAUDE.md` says "Remove SSN, Medicare, card and bank numbers before any AI call". That still holds. No change is needed unless Logan wants to say "in the browser and again on the server".

## How to check it works
1. Paste: `Your account 123456789012 is locked. SSN 123-45-6789. Call 408-555-0123.`
2. Open the browser developer tools Network tab and look at the `/api/check` request body. It must contain `[removed]` in place of the SSN and the account number, and the phone number must still be there.
3. The Results screen shows the "We removed a number..." line. A message with no personal numbers shows no such line.
4. Keyboard only works, and a screen reader announces the new line (it can live inside an existing `aria-live` area or be plain text near the top of Results).

## Priority
This simplifies the senior's experience, so it fits "when in doubt, take something away". It is small, but it touches a non-negotiable privacy rule, so Logan should decide whether it is worth doing before the 1:15 cut line. If not, put it on the "Next steps with SASCC" slide.

## Git
Logan's session commits only the files it edited, pulls with `git pull --rebase` first, and pushes to `main`.
