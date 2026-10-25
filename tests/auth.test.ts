import assert from 'assert';
import { registerUseCase } from '../src/lib/application/register.usecase';
import { loginUseCase } from '../src/lib/application/login.usecase';
import { userRepository } from '../src/lib/repositories/user.repository';
import { sessionRepository } from '../src/lib/repositories/session.repository';
import { getDatabase } from '../src/lib/db/database';

async function runAuthTests() {
  console.log('🧪 Starting NEXT YOU Authentication & Session Tests...\n');
  await getDatabase();

  const testEmail = `test_${Date.now()}@example.com`;
  const validPassword = 'SecurePassword123';

  // 1. Register with valid details
  console.log('Test 1: Register with valid details');
  const regResult = await registerUseCase({
    name: 'علی صعودی',
    email: testEmail,
    password: validPassword,
    confirmPassword: validPassword,
  });
  assert.strictEqual(regResult.success, true, 'Registration should succeed');
  assert.ok(regResult.user, 'Should return user object');
  assert.ok(regResult.sessionToken, 'Should return active session token');
  assert.strictEqual(regResult.user?.email, testEmail.toLowerCase());
  assert.strictEqual(regResult.user?.onboardingCompleted, false, 'Default onboarding should be false');
  console.log('✅ Passed\n');

  // 2. Reject duplicate email
  console.log('Test 2: Reject duplicate email');
  const dupResult = await registerUseCase({
    name: 'تکراری',
    email: testEmail,
    password: validPassword,
    confirmPassword: validPassword,
  });
  assert.strictEqual(dupResult.success, false, 'Duplicate email must fail');
  assert.strictEqual(dupResult.error, 'این ایمیل قبلاً ثبت شده است.');
  console.log('✅ Passed\n');

  // 3. Reject weak password (less than 8 chars or missing numbers)
  console.log('Test 3: Reject weak password');
  const weakResult = await registerUseCase({
    email: `weak_${Date.now()}@example.com`,
    password: 'short',
    confirmPassword: 'short',
  });
  assert.strictEqual(weakResult.success, false, 'Weak password must fail');
  assert.ok(weakResult.fieldErrors?.password, 'Should provide password error message');
  console.log('✅ Passed\n');

  // 4. Reject mismatched passwords
  console.log('Test 4: Reject mismatched confirm password');
  const mismatchResult = await registerUseCase({
    email: `mismatch_${Date.now()}@example.com`,
    password: validPassword,
    confirmPassword: 'DifferentPassword999',
  });
  assert.strictEqual(mismatchResult.success, false, 'Mismatched passwords must fail');
  assert.ok(mismatchResult.fieldErrors?.confirmPassword, 'Should flag confirmPassword mismatch');
  console.log('✅ Passed\n');

  // 5. Login with valid credentials
  console.log('Test 5: Login with valid credentials');
  const loginResult = await loginUseCase({
    email: testEmail,
    password: validPassword,
  });
  assert.strictEqual(loginResult.success, true, 'Valid login should succeed');
  assert.ok(loginResult.user, 'Should return user on login');
  assert.ok(loginResult.sessionToken, 'Should return session token');
  console.log('✅ Passed\n');

  // 6. Login with invalid credentials (protection against enumeration)
  console.log('Test 6: Login with invalid credentials (enumeration protection)');
  const wrongPassResult = await loginUseCase({
    email: testEmail,
    password: 'WrongPassword999',
  });
  assert.strictEqual(wrongPassResult.success, false, 'Wrong password must fail');
  assert.strictEqual(wrongPassResult.error, 'ایمیل یا رمز عبور صحیح نیست.');

  const nonExistentResult = await loginUseCase({
    email: 'nonexistent_user_999@example.com',
    password: 'SomePassword123',
  });
  assert.strictEqual(nonExistentResult.success, false, 'Non-existent user must fail');
  assert.strictEqual(
    nonExistentResult.error,
    'ایمیل یا رمز عبور صحیح نیست.',
    'Should return same error message for non-existent users'
  );
  console.log('✅ Passed\n');

  // 7. Verify password is NEVER stored in plain text
  console.log('Test 7: Password is NEVER stored in plain text');
  const userInDb = await userRepository.findByEmail(testEmail);
  assert.ok(userInDb, 'User must exist in database');
  assert.notStrictEqual(userInDb.passwordHash, validPassword, 'Password must not be plain text');
  assert.ok(userInDb.passwordHash.startsWith('$2'), 'Password must be bcrypt hash ($2a$ or $2b$)');
  console.log('✅ Passed\n');

  // 8. Session resolution and invalidation
  console.log('Test 8: Session validation and logout invalidation');
  const validSession = await sessionRepository.findByToken(loginResult.sessionToken!);
  assert.ok(validSession, 'Session must exist');
  assert.strictEqual(validSession.userId, userInDb.id);

  // Invalidate (logout)
  await sessionRepository.deleteByToken(loginResult.sessionToken!);
  const expiredSession = await sessionRepository.findByToken(loginResult.sessionToken!);
  assert.strictEqual(expiredSession, null, 'Invalidated session must return null');
  console.log('✅ Passed\n');

  // 9. Onboarding status update
  console.log('Test 9: Onboarding completion update');
  const updatedUser = await userRepository.updateOnboardingStatus(userInDb.id, true);
  assert.strictEqual(updatedUser?.onboardingCompleted, true, 'Onboarding status must be updated to true');
  console.log('✅ Passed\n');

  console.log('🎉 All 9 Authentication & Session test suites PASSED successfully!');
}

runAuthTests().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
