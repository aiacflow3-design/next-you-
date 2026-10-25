import assert from 'assert';
import { registerUseCase } from '../src/lib/application/register.usecase';
import { completeOnboardingUseCase } from '../src/lib/application/complete-onboarding.usecase';
import { userRepository } from '../src/lib/repositories/user.repository';
import { getDatabase } from '../src/lib/db/database';
import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from '../src/server/routes/auth.routes';
import { onboardingRouter } from '../src/server/routes/onboarding.routes';

async function runOnboardingTests() {
  console.log('🧪 Starting NEXT YOU 5-Step Onboarding Flow Tests...\n');
  await getDatabase();

  // Setup Express server for HTTP API testing
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/auth', authRouter);
  app.use('/api/onboarding', onboardingRouter);

  const server = app.listen(0);
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    // 1. Unauthenticated user cannot access onboarding API
    console.log('Test 1: Unauthenticated user cannot access onboarding');
    const unauthRes = await fetch(`${baseUrl}/api/onboarding/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        goals: ['نظم شخصی', 'تمرکز'],
        dailyTime: '۱۵ دقیقه',
        experienceLevel: 'تازه شروع کردم',
      }),
    });
    assert.strictEqual(unauthRes.status, 401, 'Should return 401 Unauthorized');
    const unauthData = await unauthRes.json();
    assert.strictEqual(unauthData.success, false);
    console.log('✅ Passed\n');

    // Create a new user via register
    const testEmail = `onboard_v2_${Date.now()}@example.com`;
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'نیما یوشیج',
        email: testEmail,
        password: 'Password123!',
        confirmPassword: 'Password123!',
      }),
    });
    assert.strictEqual(regRes.status, 201);
    const sessionCookie = regRes.headers.get('set-cookie')?.split(';')[0] || '';
    assert.ok(sessionCookie, 'Should have received session cookie');

    // 2. Authenticated user can query onboarding status
    console.log('Test 2: Authenticated user can access onboarding status');
    const statusRes = await fetch(`${baseUrl}/api/onboarding/status`, {
      headers: { Cookie: sessionCookie },
    });
    assert.strictEqual(statusRes.status, 200);
    const statusData = await statusRes.json();
    assert.strictEqual(statusData.authenticated, true);
    assert.strictEqual(statusData.onboardingCompleted, false);
    console.log('✅ Passed\n');

    // 3. Invalid onboarding data is rejected (empty payload)
    console.log('Test 3: Invalid onboarding data is rejected');
    const invalidRes = await fetch(`${baseUrl}/api/onboarding/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        goals: [],
      }),
    });
    assert.strictEqual(invalidRes.status, 400, 'Should return 400 Bad Request');
    const invalidData = await invalidRes.json();
    assert.strictEqual(invalidData.success, false);
    console.log('✅ Passed\n');

    // 4. Valid 5-step onboarding data is saved
    console.log('Test 4: Valid 5-step onboarding data is saved');
    const completeRes = await fetch(`${baseUrl}/api/onboarding/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie,
      },
      body: JSON.stringify({
        goals: ['نظم شخصی', 'تمرکز', 'ساخت عادت'],
        dailyTime: '۱۵ دقیقه',
        experienceLevel: 'مدتی است تلاش میکنم',
      }),
    });
    assert.strictEqual(completeRes.status, 200, 'Should return 200 OK');
    const completeData = await completeRes.json();
    assert.strictEqual(completeData.success, true);
    assert.deepStrictEqual(completeData.user.onboardingGoals, ['نظم شخصی', 'تمرکز', 'ساخت عادت']);
    assert.strictEqual(completeData.user.onboardingDailyTime, '۱۵ دقیقه');
    assert.strictEqual(completeData.user.onboardingExperienceLevel, 'مدتی است تلاش میکنم');
    console.log('✅ Passed\n');

    // 5. onboardingCompleted becomes true
    console.log('Test 5: onboardingCompleted becomes true');
    assert.strictEqual(completeData.user.onboardingCompleted, true);
    console.log('✅ Passed\n');

    // 6. Completion timestamp is stored
    console.log('Test 6: Completion timestamp is stored');
    assert.ok(completeData.user.onboardingCompletedAt, 'Must have onboardingCompletedAt timestamp');
    const dateParsed = new Date(completeData.user.onboardingCompletedAt);
    assert.ok(!isNaN(dateParsed.getTime()), 'Timestamp must be valid date');
    console.log('✅ Passed\n');

    // 7. Successful completion redirects to /assessment
    console.log('Test 7: Successful completion redirects to /assessment');
    assert.strictEqual(completeData.redirectTo, '/assessment');
    console.log('✅ Passed\n');

    // 8. In DB verification
    console.log('Test 8: Database state verification');
    const userInDb = await userRepository.findByEmail(testEmail);
    assert.ok(userInDb);
    assert.strictEqual(userInDb.onboardingCompleted, true);
    assert.deepStrictEqual(userInDb.onboardingGoals, ['نظم شخصی', 'تمرکز', 'ساخت عادت']);
    assert.strictEqual(userInDb.onboardingDailyTime, '۱۵ دقیقه');
    assert.strictEqual(userInDb.onboardingExperienceLevel, 'مدتی است تلاش میکنم');
    assert.ok(userInDb.onboardingCompletedAt);
    console.log('✅ Passed\n');

    // 9. Status endpoint reflects completed onboarding
    console.log('Test 9: Status endpoint reflects completed onboarding');
    const updatedStatusRes = await fetch(`${baseUrl}/api/onboarding/status`, {
      headers: { Cookie: sessionCookie },
    });
    const updatedStatusData = await updatedStatusRes.json();
    assert.strictEqual(updatedStatusData.onboardingCompleted, true);
    assert.deepStrictEqual(updatedStatusData.goals, ['نظم شخصی', 'تمرکز', 'ساخت عادت']);
    assert.strictEqual(updatedStatusData.dailyTime, '۱۵ دقیقه');
    assert.strictEqual(updatedStatusData.experienceLevel, 'مدتی است تلاش میکنم');
    console.log('✅ Passed\n');

    console.log('🎉 All 9 5-step Onboarding tests PASSED successfully!');
  } finally {
    server.close();
  }
}

runOnboardingTests().catch((err) => {
  console.error('❌ Onboarding Test failed:', err);
  process.exit(1);
});
