# Request for Logan (and Logan's Claude session): copy-and-paste help and voice typing on Home

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

## 2. Voice typing: the microphone key on phones, hold the space bar on laptops
Isabel's idea, refined: on **phones and tablets** the keyboard's own 🎤 microphone does the job (a web page can't see a phone keyboard's space bar, so hold-space can't work there). On **laptops and desktops** a page can see the space bar, so **press and hold the space bar, talk, let go** can work. Two different tips, shown by device type.

### 2a. Phones and tablets: reword the existing tip
Today: *"Tip: tap the 🎤 on your keyboard to speak instead of typing."* Suggested:

> **Rather talk than type?** Tap the **🎤 microphone** on your phone's keyboard, then say it out loud. Your phone turns your words into text.

Keep the word "microphone" next to the icon, so the icon is never the only clue. Show it when the device has a touch screen as its main input: `matchMedia('(pointer: coarse)').matches`.

### 2b. Laptops and desktops: hold the space bar to talk (new, optional)
Show this tip instead of the phone tip when `matchMedia('(pointer: fine)').matches` **and** the browser has speech recognition (`window.SpeechRecognition || window.webkitSpeechRecognition`). If the browser has none, show no voice tip at all (typing and pasting still work).

> **Rather talk than type?** Click in the box, then **press and hold the space bar** and talk. Let go when you are done.

**Behavior**
- Only when the cursor is **inside the message box**. Never on buttons or links: the space bar must keep activating those (keyboard users, screen reader users).
- A normal tap still types a space. Do this: on the space bar's `keydown` in the box, `preventDefault()` and start a timer of about half a second. If the key is released before the timer ends, insert one space at the cursor yourself (`setRangeText`). If the timer ends, start listening, and ignore the key repeats (`event.repeat`).
- **Listening only while the key is held.** On `keyup` stop. Also stop on blur, when the tab is hidden, and on any error. Never keep the microphone open.
- Put the recognized words into the box at the cursor, with a space before them if needed. The senior can read and fix them before tapping **Check it**. Don't submit automatically.
- Set the recognition language from the page or browser (`navigator.language`), so a Spanish speaker can talk in Spanish.
- **Show it clearly while listening**, with words, not just color or an icon: a line like **"🎤 Listening… let go of the space bar when you are done."** in a `role="status"` element that is announced to screen readers. Hide it as soon as the key is released.
- If the microphone is blocked, or the service fails, show one gentle line ("We could not use the microphone. You can still type or paste the message.") and hide the voice tip. Never block typing.
- No new button, so Home stays at two buttons. Render all text with `textContent`.
- The voice text goes into the box and then through the normal check, so the browser-side removal of personal numbers still applies.

**Privacy: this changes what we can promise, so Logan should decide before building it**
- Browser speech recognition is done by a **cloud service run by the browser's maker**: Google in Chrome, Microsoft in Edge, Apple in Safari. Our server never hears the audio and we store nothing, but the audio **does** leave the device. Our current wording ("We don't save what you share") stays true for us, but we shouldn't suggest nothing leaves the device.
- If built, add one honest line near the tip, or in About: *"On a computer, voice typing is done by your browser's speech service. We never record or save it."* Update the family privacy text in the Learn about screens and `about.html` to match.
- It only listens while the key is held, so it doesn't conflict with "the app never listens to or records calls". Consider a short pitch line: "It listens only while you hold the key."
- **Brave** (Isabel's browser) often can't use this speech service, so Isabel may not be able to try it there. Test in Chrome, Edge or Safari. Because the tip only appears when the feature exists, and hides itself on an error, this is safe for everyone else.

**Priority and fallback:** P3, a nice extra that mainly helps laptop users. The demo and most seniors will be on phones. If time is short, do 2a only and put 2b on the Next Steps page.

## How to check it works
1. Home shows the paste instructions under the label, above the box. They read well at 200% zoom and at phone width, with no sideways scroll.
2. With a screen reader or by tabbing to the box, the instructions are read with the box.
3. The Home screen still has no more than two buttons (**I'm on a call right now** and **Check it**).
4. On a phone (or a narrow touch device), the tip names the 🎤 and says "microphone" in words.
5. On a laptop in Chrome, Edge or Safari: tap the space bar in the box and a space is typed. Hold it for about half a second and "Listening…" appears. Talk, let go, and the words appear in the box. Click away while holding: listening stops. Block the microphone: a gentle message, typing still works.
6. On a laptop, the space bar still activates buttons and links when they are focused.
7. In a browser with no speech support (for example Firefox), no voice tip shows at all.

## Priority
Small and low risk (P2): it helps the least confident users get started. It doesn't touch the check itself.
