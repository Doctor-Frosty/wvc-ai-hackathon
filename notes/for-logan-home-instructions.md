# Request for Logan (and Logan's Claude session): copy-and-paste help and a clearer voice tip on Home

From: Isabel (`isabel-aurora`). Written by Isabel's Claude session.
Why this file is in `notes/`: Isabel may only edit her own files. Both changes are in Logan's files (`public/index.html`, maybe `public/style.css`), so **nothing here has been applied**. Logan decides.

## For Logan's Claude agent
Read this whole file. **Ask Logan to confirm before editing anything.** If he says yes, make the change, test it, and commit only the files you edited. The wording is final below.

## 1. Add a short "how to copy and paste" instruction (Home, `public/index.html`)
Many seniors don't know how to copy a message and paste it. Add a short note under the label **"Paste the message, or type what the caller said."**, with the same `.note` styling as the privacy line above the box.

Suggested text (keep it to these three short lines, as a small list or three short sentences):

> **To copy a message:** press and hold your finger on the message, then tap **Copy**.
> **To paste it here:** press and hold your finger inside the box below, then tap **Paste**.
> On a computer: press **Ctrl** and **V** to paste. On a Mac, press **Command** and **V**.

Notes:
- Words only, no screenshots, nothing to tap. It's text, not a new button (the simplicity rule: at most two buttons per screen).
- Add the note's `id` to the textarea's `aria-describedby` (today: `privacy-note mic-tip check-error`), so a screen reader reads it too.
- 20px or larger, 7:1 contrast. The existing `.note` class already does this.
- If the page gets too long on a phone, put the computer line last and cut that one first. Keep the two phone lines.

## 2. The voice tip: keep it, but make it clearer. Don't change it to "hold the space bar".
Isabel asked for dictation by pressing and holding the space bar, so seniors wouldn't have to find the microphone key. **That can't be built reliably, and we shouldn't try.** Why:
- **A web page can't see the phone keyboard's space bar.** The keyboard on a phone or tablet belongs to the phone, not to our page. On Android the page doesn't get a reliable key event for the space bar, and on iPhone holding it moves the cursor. So it would work on nobody's phone, which is where seniors will use this.
- **Holding the space bar already means something else.** On phones it moves the text cursor or switches the language. On a computer a held space bar repeats spaces while typing, so we couldn't tell "typing a long gap" from "start dictating".
- **The browser's own speech recognition sends the voice to Google or Apple** to turn it into text. That would break "We don't save what you share" and our privacy promise, and the app must never listen to calls. The keyboard's built-in microphone is handled by the phone itself, which is why we use it.

**What we can do instead (small, safe):** reword the existing tip so it's easier to find and understand. Today: *"Tip: tap the 🎤 on your keyboard to speak instead of typing."* Suggested:

> **Rather talk than type?** Tap the **🎤 microphone** on your phone's keyboard, then say it out loud. Your phone turns your words into text.

(Keep the 🎤 with the word "microphone" next to it, so the icon is never the only clue.)

If Logan wants a stronger voice feature later, put it on the Next Steps page: a "Speak" button would need a decision about privacy (which service hears the audio) and the two-button limit on Home.

## How to check it works
1. Home shows the paste instructions under the label, above the box, and they read well at 200% zoom and at phone width, with no sideways scroll.
2. With a screen reader or by tabbing to the box, the instructions are read with the box.
3. The Home screen still has no more than two buttons (**I'm on a call right now** and **Check it**).
4. The tip names the 🎤 and says "microphone" in words.

## Priority
Small and low risk (P2): it helps the least confident users get started. It doesn't touch the check itself.
