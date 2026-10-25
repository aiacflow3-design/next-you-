import assert from 'assert';
import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from '../src/server/routes/auth.routes';
import { getDatabase } from '../src/lib/db/database';

async function runApiTests() {
  console.log('🧪 Starting NEXT YOU HTTP Auth API Tests...\n');
  await getDatabase();

  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/auth', authRouter);

  const server = app.listen(0);
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const email = `api_user_${Date.now()}@example.com`;
    const password = 'StrongPassword123';

    // 1. POST /api/auth/register
    console.log('HTTP Test 1: POST /api/auth/register');
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'رضا کمالی',
        email,
        password,
        confirmPassword: password,
      }),
    });
    assert.strictEqual(regRes.status, 201, 'Status should be 201 Created');
    const setCookieHeader = regRes.headers.get('set-cookie');
    assert.ok(setCookieHeader, 'Must set session cookie');
    assert.ok(setCookieHeader.includes('next_you_session='), 'Cookie name must be next_you_session');
    assert.ok(setCookieHeader.toLowerCase().includes('httponly'), 'Cookie must be HttpOnly');

    const regData = await regRes.json();
    assert.strictEqual(regData.success, true);
    assert.strictEqual(regData.user.email, email.toLowerCase());
    console.log('✅ Passed\n');

    // Extract cookie for subsequent calls
    const sessionCookie = setCookieHeader.split(';')[0];

    // 2. GET /api/auth/me with session cookie
    console.log('HTTP Test 2: GET /api/auth/me with valid session cookie');
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(meRes.status, 200);
    const meData = await meRes.json();
    assert.strictEqual(meData.authenticated, true);
    assert.strictEqual(meData.user.email, email.toLowerCase());
    assert.strictEqual(meData.user.onboardingCompleted, false);
    console.log('✅ Passed\n');

    // 3. POST /api/auth/complete-onboarding
    console.log('HTTP Test 3: POST /api/auth/complete-onboarding');
    const obRes = await fetch(`${baseUrl}/api/auth/complete-onboarding`, {
      method: 'POST',
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(obRes.status, 200);
    const obData = await obRes.json();
    assert.strictEqual(obData.success, true);
    assert.strictEqual(obData.user.onboardingCompleted, true);
    console.log('✅ Passed\n');

    // 4. POST /api/auth/logout
    console.log('HTTP Test 4: POST /api/auth/logout');
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(logoutRes.status, 200);
    const logoutCookie = logoutRes.headers.get('set-cookie');
    assert.ok(logoutCookie?.includes('Expires=') || logoutCookie?.includes('Max-Age=0'));
    console.log('✅ Passed\n');

    // 5. GET /api/auth/me after logout -> unauthenticated
    console.log('HTTP Test 5: GET /api/auth/me after logout');
    const meAfterLogout = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(meAfterLogout.status, 200);
    const meAfterData = await meAfterLogout.json();
    assert.strictEqual(meAfterData.authenticated, false);
    assert.strictEqual(meAfterData.user, null);
    console.log('✅ Passed\n');

    console.log('🎉 All HTTP API integration tests PASSED successfully!');
  } finally {
    server.close();
  }
}

runApiTests().catch((err) => {
  console.error('❌ HTTP API Test failed:', err);
  process.exit(1);
});
