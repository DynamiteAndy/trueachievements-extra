import { until, wait } from './wait';
describe('until', () => {
  test('should resolve to true when the condition is met', async () => {
    let conditionMet = false;

    const promise = until(() => conditionMet === true, 1000);

    setTimeout(() => {
      conditionMet = true;
    }, 500);

    const result = await promise;
    expect(result).toBe(true);
  });

  test('should resolve to false when the condition is not met within the timeout', async () => {
    const promise = until(() => false, 500);
    const result = await promise;

    expect(result).toBe(false);
  });
});

describe('wait', () => {
  test('should resolve after the specified timeout', async () => {
    const start = new Date();
    const timeoutMs = 1000;
    await wait(timeoutMs);
    const end = new Date();

    const elapsed = end.getTime() - start.getTime();
    expect(elapsed).toBeGreaterThanOrEqual(timeoutMs - 5);
  });
});
