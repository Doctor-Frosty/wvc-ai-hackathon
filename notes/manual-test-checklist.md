# Manual test checklist: Second Look

All messages are **made up** (555 phone numbers, invented websites). Use them freely.
Generated from `notes/test-scams.json`. The automatic version is `node notes/run-scam-tests.mjs`.

## Before you start
1. Open http://localhost:3000 (or the phone address).
2. Open **Family setup**, tap **Use example setup**. This saves Margaret: Wells Fargo, Kaiser Permanente, PG&E and AT&T; checking, savings and credit card; helper Sarah.
3. Cases marked **Profile: Margaret** are meant to be tried **with** that setup. Cases marked **Profile: none** are meant to be tried **without** it: in Family setup, tap **Delete everything** (twice) first, then switch back to the example when a case says Margaret. (Or use a private/second browser window for "none".)

## How to test each message
Copy the text in the box, paste it into the Home box, tap **Check it**, and compare the answer with **Expect**. Tick the box if it matches. If it doesn't, write what you saw in **Notes**.

Also look at every result for:
- [ ] The answer starts with an icon **and** words (never color alone)
- [ ] No more than 3 reasons and 3 steps
- [ ] Phone numbers and links from the message are **plain text, not clickable**
- [ ] The wording is gentle and makes sense with no memory of earlier visits
- [ ] Nothing says "safe"


---

## Scams: government

### 1. irs-arrest
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
IRS FINAL NOTICE: You owe $4,812 in back taxes. A warrant will be issued for your arrest today. Call 408-555-0142 immediately to resolve.
```

**Notes:** 

### 2. ssa-suspended
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
Social Security Administration: Your Social Security number has been suspended due to suspicious activity. Press 1 to speak with an officer, or your benefits will be cancelled.
```

**Notes:** 

### 3. medicare-free-kit
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
Medicare: You are eligible for a free back brace and genetic test kit. Please confirm your Medicare ID to receive it.
```

**Notes:** 

---

## Scams: banks and your trusted list

### 4. wells-fraud-safe-account
- [ ] **Passed**  |  **Profile:** Margaret (example setup)  |  **Expect:** ⛔ This looks like a scam

```text
This is the fraud department at Wells Fargo. We detected a suspicious charge of $950. To protect your money, move your savings to a safe account. Do not tell the teller.
```

**Notes:** 

### 5. bofa-not-your-bank
- [ ] **Passed**  |  **Profile:** Margaret (example setup)  |  **Expect:** ⛔ This looks like a scam

```text
Bank of America: a $1,299 purchase was made on your card. If this was not you, call us now at 408-555-0166.
```

**Notes:** 

### 6. citi-auto-loan-link
- [ ] **Passed**  |  **Profile:** Margaret (example setup)  |  **Expect:** ⛔ This looks like a scam

```text
Citibank: Your auto loan payment is overdue. Pay now at citi-payments.xyz
```

**Notes:** 

### 7. zelle-sent-by-mistake
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
Zelle: You received a payment of $500 by mistake. Please send it back right away to avoid your account being frozen.
```

**Notes:** 

### 8. chase-same-message-margaret
- [ ] **Passed**  |  **Profile:** Margaret (example setup)  |  **Expect:** ⛔ This looks like a scam

```text
Chase: Your home loan payment is due on the 15th. You can pay in the Chase app.
```

**Notes:** 

### 9. chase-same-message-no-profile
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ✅ No warning signs found  or  ⚠️ Be careful

```text
Chase: Your home loan payment is due on the 15th. You can pay in the Chase app.
```

**Notes:** 

---

## Scams: utilities, delivery, shopping, tech support and other

### 10. pge-shutoff-prepaid
- [ ] **Passed**  |  **Profile:** Margaret (example setup)  |  **Expect:** ⛔ This looks like a scam

```text
PG&E: Your power will be shut off in 1 hour for non-payment. Pay $320 now with prepaid cards at the nearest store or call 408-555-0177.
```

**Notes:** 

### 11. usps-redelivery-link
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
USPS: Your package could not be delivered due to an incomplete address. Update your delivery details within 24 hours: usps-redelivery.top/track
```

**Notes:** 

### 12. toll-balance
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
Final notice: You have an unpaid toll balance of $6.99. Pay today to avoid a $50 late fee. tollpay-ca.com/pay
```

**Notes:** 

### 13. amazon-iphone-order
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam  or  ⚠️ Be careful

```text
Amazon: A $899 order for an iPhone was placed on your account. If you did not make this purchase, call 855-555-0188 immediately to cancel.
```

**Notes:** 

### 14. parking-qr
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam  or  ⚠️ Be careful

```text
Parking violation notice: scan this QR code to pay your fine of $65 within 24 hours.
```

**Notes:** 

### 15. tech-popup-virus
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
WARNING: Your computer is infected with a virus! Do not shut down. Call Microsoft Support at 800-555-0123 now. A technician will need to connect to your computer.
```

**Notes:** 

### 16. norton-renewal-refund  (known issue)
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam  or  ⚠️ Be careful

```text
Your Norton subscription has been renewed for $399.99. If you did not authorize this, call 800-555-0101 to request a refund.
```

> Known issue: the automatic test did not give the expected answer. See `notes/test-findings-for-logan.md`.

**Notes:** 

---

## Scams: family emergency (grandparent)

### 17. grandma-courier
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
Grandma it's me, I'm in trouble. I was in an accident and I need $3,000 for the lawyer. Please don't tell Mom or Dad. I'll send a courier to pick up cash.
```

**Notes:** 

### 18. grandpa-hospital-wire
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
Hi Grandpa, I'm in the hospital and can't talk long. Please wire money to this account for my treatment. Keep this between us.
```

**Notes:** 

---

## Scams: investment and romance

### 19. romance-crypto
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
I'm so happy we met, my love. My uncle taught me a crypto investment platform with guaranteed returns. Let me show you how to start with just $500.
```

**Notes:** 

### 20. wrong-number-friend  (known issue)
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam  or  ⚠️ Be careful

```text
Hi Margaret, sorry, wrong number! You seem like a really nice person though. I'm a trader and I'd love to be friends.
```

> Known issue: the automatic test did not give the expected answer. See `notes/test-findings-for-logan.md`.

**Notes:** 

### 21. retirement-seminar
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
Join our free seminar: risk-free retirement income, huge returns, limited seats. Call 408-555-0133.
```

**Notes:** 

---

## Scams: prizes, jobs, refunds and charity

### 22. sweepstakes-fee
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
Congratulations! You've won the $1,000,000 Publishers Sweepstakes. To claim your prize, pay the $299 processing fee with a gift card.
```

**Notes:** 

### 23. inheritance-lawyer
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
I am a lawyer representing the estate of a distant relative who left you an inheritance of $2.5 million. Please send your bank account number so we can transfer the funds.
```

**Notes:** 

### 24. fake-check-job
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
Work from home as a package inspector! We will mail you a check for $2,850. Deposit it and send $2,000 back by Zelle for equipment.
```

**Notes:** 

### 25. overpaid-refund  (known issue)
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
You have been overpaid a refund of $400 by mistake. Please wire the difference back to us today.
```

> Known issue: the automatic test did not give the expected answer. See `notes/test-findings-for-logan.md`.

**Notes:** 

### 26. charity-gift-cards
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ⛔ This looks like a scam

```text
Hello, I'm calling for the Veterans Relief Fund. We need your donation today. We accept gift cards, or cash picked up by a courier.
```

**Notes:** 

---

## Real messages (should NOT be called a scam)

### 27. legit-pharmacy
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ✅ No warning signs found

```text
Hi Margaret, this is Linda from the pharmacy. Your prescription is ready for pickup. We're open until 7 tonight.
```

**Notes:** 

### 28. legit-lunch
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ✅ No warning signs found

```text
Hi Mom, are we still on for lunch Sunday? I can pick you up at noon.
```

**Notes:** 

### 29. legit-grandchild
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ✅ No warning signs found  or  ⚠️ Be careful

```text
Grandma, it's Emma! Mom said you're feeling better. Can I come by Saturday and bring cookies?
```

**Notes:** 

### 30. legit-new-baby
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ✅ No warning signs found

```text
Mom, we are at the hospital with the baby! Everything is fine, a healthy girl. Come when you can.
```

**Notes:** 

### 31. legit-kaiser-appointment  (known issue)
- [ ] **Passed**  |  **Profile:** Margaret (example setup)  |  **Expect:** ✅ No warning signs found  or  ⚠️ Be careful

```text
Kaiser Permanente: Reminder: You have an appointment with Dr. Patel on Tuesday at 10:30 AM. Reply C to confirm or call the number on your appointment card to reschedule.
```

> Known issue: the automatic test did not give the expected answer. See `notes/test-findings-for-logan.md`.

**Notes:** 

### 32. legit-wells-statement
- [ ] **Passed**  |  **Profile:** Margaret (example setup)  |  **Expect:** ✅ No warning signs found  or  ⚠️ Be careful

```text
Wells Fargo: Your monthly statement is ready. Sign in to the Wells Fargo app to view it. No action is needed.
```

**Notes:** 

### 33. legit-pge-bill
- [ ] **Passed**  |  **Profile:** Margaret (example setup)  |  **Expect:** ✅ No warning signs found  or  ⚠️ Be careful

```text
PG&E: Your October bill is ready. Amount due $84.20 by Nov 25. Open the PG&E app to view or pay.
```

**Notes:** 

### 34. legit-att-bill
- [ ] **Passed**  |  **Profile:** Margaret (example setup)  |  **Expect:** ✅ No warning signs found  or  ⚠️ Be careful

```text
AT&T: Your October bill is $65.10 and will be charged to your card on file on the 15th. Manage your plan in the myAT&T app.
```

**Notes:** 

### 35. legit-google-code  (known issue)
- [ ] **Passed**  |  **Profile:** none  |  **Expect:** ✅ No warning signs found  or  ⚠️ Be careful

```text
Your Google verification code is 482913. Do not share it with anyone. If you did not ask for this code, you can ignore this message.
```

> Known issue: the automatic test did not give the expected answer. See `notes/test-findings-for-logan.md`.

**Notes:** 

---

## Privacy checks (personal numbers should be removed automatically)
Fictional numbers only. For each, tap **Check it**, then in the browser's developer tools (Network tab, the `/api/check` request) confirm the sent text shows `[removed]` where the number was, and that the phone number is still there.

### P1. Social Security and account number
- [ ] **Passed**

```text
Your account 123456789012 is locked. SSN 123-45-6789. Call 408-555-0123.
```

### P2. Card number
- [ ] **Passed**

```text
We could not charge your card 4111 1111 1111 1111. Call 408-555-0123 to update it.
```

### P3. Medicare number
- [ ] **Passed**

```text
Medicare needs to confirm your number 1EG4-TE5-MK73 to keep your coverage.
```

- [ ] The Results screen shows a gentle line saying a number was removed (only for P1 to P3)
- [ ] A message with no personal numbers does **not** show that line

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
