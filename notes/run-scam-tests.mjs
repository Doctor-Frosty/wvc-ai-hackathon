// Runs every case in notes/test-scams.json and notes/test-scams-more.json against a running Second Look server.
// Usage: node notes/run-scam-tests.mjs            (default http://localhost:3000)
//        BASE=http://172.20.10.6:3000 node notes/run-scam-tests.mjs
// Sends only the fictional test messages. Stores nothing.

import { readFileSync } from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:3000';
const FILES = ['./test-scams.json', './test-scams-more.json'];
const cases = FILES.flatMap((f) => JSON.parse(readFileSync(new URL(f, import.meta.url), 'utf8')).cases);

const MARGARET = {
  companies: ['Wells Fargo', 'Kaiser Permanente', 'PG&E', 'AT&T'],
  accounts: ['checking', 'savings', 'credit card'],
};

let pass = 0;
const misses = [];

for (const c of cases) {
  let result;
  let status = 200;
  try {
    const text = c.repeat ? c.text.repeat(c.repeat) : c.text;
    const res = await fetch(`${BASE}/api/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, trusted: c.profile === 'margaret' ? MARGARET : undefined }),
    });
    status = res.status;
    result = await res.json().catch(() => ({}));
  } catch (err) {
    console.error(`Could not reach ${BASE}: ${err.message}`);
    process.exit(2);
  }
  const ok = c.expectStatus ? status === c.expectStatus : c.expect.includes(result.verdict);
  if (ok) pass += 1;
  else {
    const kind = c.type === 'legitimate' ? 'FALSE ALARM' : 'MISSED SCAM';
    misses.push({ c, result, kind });
  }
  const got = c.expectStatus ? `HTTP ${status}` : String(result.verdict);
  const want = c.expectStatus ? `HTTP ${c.expectStatus}` : c.expect.join('|');
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.id.padEnd(32)} got ${got.padEnd(8)} want ${want.padEnd(12)} flags: ${(result.flags || []).join(', ')}`);
}

console.log(`\n${pass} of ${cases.length} passed.`);
if (misses.length) {
  console.log('\nNeeds a look:');
  for (const { c, result, kind } of misses) {
    console.log(`- [${kind}] ${c.id}: got ${c.expectStatus ? 'HTTP ' + status : result.verdict}, wanted ${c.expectStatus ? 'HTTP ' + c.expectStatus : c.expect.join(' or ')}`);
  }
}
process.exit(misses.length ? 1 : 0);
