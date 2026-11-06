// Runs every case in notes/test-scams.json against a running Second Look server.
// Usage: node notes/run-scam-tests.mjs            (default http://localhost:3000)
//        BASE=http://172.20.10.6:3000 node notes/run-scam-tests.mjs
// Sends only the fictional test messages. Stores nothing.

import { readFileSync } from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:3000';
const file = new URL('./test-scams.json', import.meta.url);
const { cases } = JSON.parse(readFileSync(file, 'utf8'));

const MARGARET = {
  companies: ['Wells Fargo', 'Kaiser Permanente', 'PG&E', 'AT&T'],
  accounts: ['checking', 'savings', 'credit card'],
};

let pass = 0;
const misses = [];

for (const c of cases) {
  let result;
  try {
    const res = await fetch(`${BASE}/api/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: c.text, trusted: c.profile === 'margaret' ? MARGARET : undefined }),
    });
    result = await res.json();
  } catch (err) {
    console.error(`Could not reach ${BASE}: ${err.message}`);
    process.exit(2);
  }
  const ok = c.expect.includes(result.verdict);
  if (ok) pass += 1;
  else {
    const kind = c.type === 'legitimate' ? 'FALSE ALARM' : 'MISSED SCAM';
    misses.push({ c, result, kind });
  }
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.id.padEnd(32)} got ${String(result.verdict).padEnd(8)} want ${c.expect.join('|').padEnd(12)} flags: ${(result.flags || []).join(', ')}`);
}

console.log(`\n${pass} of ${cases.length} passed.`);
if (misses.length) {
  console.log('\nNeeds a look:');
  for (const { c, result, kind } of misses) {
    console.log(`- [${kind}] ${c.id}: got ${result.verdict}, wanted ${c.expect.join(' or ')}`);
  }
}
process.exit(misses.length ? 1 : 0);
