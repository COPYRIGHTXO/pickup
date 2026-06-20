// Quick API test script
const BASE = 'http://localhost:3001/api';

async function test(label, url, options) {
  try {
    const res = await fetch(url, options);
    const json = await res.json();
    console.log(`✓ ${label} [${res.status}]`, json.success ? 'OK' : json.error);
    return json;
  } catch (e) {
    console.log(`✗ ${label}:`, e.message);
  }
}

async function run() {
  // GET endpoints
  await test('GET /api/health', `${BASE}/health`);
  await test('GET /api/creators', `${BASE}/creators`);
  await test('GET /api/creators?platform=Instagram', `${BASE}/creators?platform=Instagram`);
  await test('GET /api/creators/@mayaeats', `${BASE}/creators/@mayaeats`);
  await test('GET /api/campaigns', `${BASE}/campaigns`);
  await test('GET /api/campaigns/pipeline', `${BASE}/campaigns/pipeline`);
  await test('GET /api/fraud/signals', `${BASE}/fraud/signals`);
  await test('GET /api/roi/scenarios', `${BASE}/roi/scenarios`);
  await test('GET /api/settings', `${BASE}/settings`);
  await test('GET /api/site', `${BASE}/site`);

  // POST endpoints
  await test('POST /api/fraud/scan', `${BASE}/fraud/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: '@mayamakes' }),
  });

  await test('POST /api/roi/predict', `${BASE}/roi/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creators: 8, fees: 72000, followers: 3800000, productPrice: 48, conversionRate: 2.4, duration: 21 }),
  });

  await test('POST /api/contact', `${BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@brand.com', goal: 'Summer campaign' }),
  });

  await test('GET /api/contact/submissions', `${BASE}/contact/submissions`);

  console.log('\n--- All tests complete ---');
}

run();
