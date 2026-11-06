# Test findings for Logan (and Logan's Claude session)

Source: `node notes/run-scam-tests.mjs` against the rules-only server (no Gemini key). 35 fictional messages in `notes/test-scams.json`: 30 passed, 5 need a look. The rules live in `lib/redflags.js` (Logan's file), so **nothing here has been changed**. Ask Logan before editing. Each fix is optional and small.

## Missed scams (the checker said "No warning signs found")
1. **`overpaid-refund`:** "You have been overpaid a refund of $400 by mistake. Please wire the difference back to us today."
   Likely cause: the `payment` rule needs `wire (transfer|the money|money)`, and "wire the difference" doesn't match. Idea: allow `wire (back|the \w+|it)` or add `\boverpaid\b` / `refund.{0,40}\b(send|wire|return) (back|the)`.
2. **`norton-renewal-refund`:** "Your Norton subscription has been renewed for $399.99. If you did not authorize this, call 800-555-0101 to request a refund."
   A very common fake-invoice scam. Idea: a medium rule for "renewed/charged $N ... call [number]" plus "if you did not authorize".
3. **`wrong-number-friend`:** "sorry, wrong number! ... I'm a trader and I'd love to be friends."
   The first step of the "wrong number" investment scam. Idea: a medium rule for `wrong number` combined with `trader|investor|invest`. The Gemini step may already catch this.

## False alarms (a real message got "This looks like a scam", which is the worse error for trust)
4. **`legit-kaiser-appointment`:** "Reply C to confirm or call the number on your appointment card."
   The `personal_info` rule `(verify|confirm|update).{0,25}(identity|account|information|details|number)` matches "confirm or call the number". Idea: require the object to be nearer, or drop `number` from that group, or exclude "appointment".
5. **`legit-google-code`:** "Your Google verification code is 482913. Do not share it with anyone."
   The `personal_info` rule matches "verification code", but this message is *giving* a code, not asking for one. Idea: only flag when it asks: `(send|give|read|tell|share|provide|enter).{0,20}(code|pin|password)`.

## Why this matters for the demo
Wrongly calling a real doctor's reminder a scam makes the tool look unreliable to judges and to seniors. The five demo messages in `examples/demo-messages.json` all pass, so these fixes are optional polish. Re-run `node notes/run-scam-tests.mjs` after any rules change to check nothing else broke.
