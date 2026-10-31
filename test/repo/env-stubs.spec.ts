// The Vitest config's unstubEnvs: an env stubbed in one test is back to its own value in the next, while the GM_ APIs
// the Tampermonkey mock (test/mocks/tampermonkey.ts, loaded by setup.ts) stubs once are left alone. The two tests run
// in order, the second reading what the first left
describe('env stubs', { shuffle: false }, () => {
  const original = process.env.NODE_ENV;

  test('should let a test stub an env', () => {
    vi.stubEnv('NODE_ENV', 'stubbed-for-a-test');

    expect(process.env.NODE_ENV).toBe('stubbed-for-a-test');
  });

  test("should put the env back for the next test, keeping setup's globals", () => {
    expect(process.env.NODE_ENV).toBe(original);
    expect(GM_getValue('missing', 'fallback')).toBe('fallback');
  });
});
