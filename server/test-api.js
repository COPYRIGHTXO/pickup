// Comprehensive API test script
const BASE = 'http://localhost:3001/api';

let passed = 0;
let failed = 0;

async function test(label, url, options, expectStatus = 200) {
  try {
    const res = await fetch(url, options);
    const json = await res.json();
    const ok = res.status === expectStatus;
    if (ok) {
      passed++;
      console.log(`  ✓ ${label} [${res.status}]`);
    } else {
      failed++;
      console.log(`  ✗ ${label} — expected ${expectStatus}, got ${res.status}:`, json.error || '');
    }
    return json;
  } catch (e) {
    failed++;
    console.log(`  ✗ ${label}: ${e.message}`);
    return null;
  }
}

async function run() {
  console.log('\n── GET endpoints ──');
  await test('GET /api/health', `${BASE}/health`);
  await test('GET /api/creators', `${BASE}/creators`);
  await test('GET /api/creators?platform=Instagram', `${BASE}/creators?platform=Instagram`);
  await test('GET /api/creators?niche=Fitness', `${BASE}/creators?niche=Fitness`);
  await test('GET /api/creators?minMatch=95', `${BASE}/creators?minMatch=95`);
  await test('GET /api/creators/@mayaeats', `${BASE}/creators/@mayaeats`);
  await test('GET /api/creators/mayaeats (no @)', `${BASE}/creators/mayaeats`);
  await test('GET /api/campaigns', `${BASE}/campaigns`);
  await test('GET /api/campaigns/pipeline', `${BASE}/campaigns/pipeline`);
  await test('GET /api/campaigns/glow-serum-launch', `${BASE}/campaigns/glow-serum-launch`);
  await test('GET /api/fraud/signals', `${BASE}/fraud/signals`);
  await test('GET /api/roi/scenarios', `${BASE}/roi/scenarios`);
  await test('GET /api/settings', `${BASE}/settings`);
  await test('GET /api/site', `${BASE}/site`);
  await test('GET /api/contact/submissions', `${BASE}/contact/submissions`);

  console.log('\n── POST endpoints ──');
  await test('POST /api/fraud/scan', `${BASE}/fraud/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: '@mayamakes' }),
  });

  await test('POST /api/fraud/scan (suspicious)', `${BASE}/fraud/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: '@fakeguru_bot' }),
  });

  await test('POST /api/roi/predict', `${BASE}/roi/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creators: 8, fees: 72000, followers: 3800000, productPrice: 48, conversionRate: 2.4, duration: 21 }),
  });

  await test('POST /api/roi/predict (defaults)', `${BASE}/roi/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  await test('POST /api/contact', `${BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@brand.com', goal: 'API test run' }),
  }, 201);

  console.log('\n── Error/edge cases ──');
  await test('GET unknown creator (404)', `${BASE}/creators/@doesnotexist`, undefined, 404);
  await test('GET unknown campaign (404)', `${BASE}/campaigns/nonexistent`, undefined, 404);
  await test('POST creator missing fields (400)', `${BASE}/creators`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test' }),
  }, 400);
  await test('POST contact missing email (400)', `${BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal: 'No email' }),
  }, 400);
  await test('POST contact bad email (400)', `${BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email' }),
  }, 400);
  await test('POST fraud scan missing handle (400)', `${BASE}/fraud/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  }, 400);
  await test('GET /api/nonexistent (API 404)', `${BASE}/nonexistent`, undefined, 404);
  await test('PUT unknown settings group (404)', `${BASE}/settings/nonexistent`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: [] }),
  }, 404);

  console.log(`\n── Results: ${passed} passed, ${failed} failed ──\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run();
