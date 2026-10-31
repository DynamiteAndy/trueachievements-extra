import { useFakeTimers } from '@ta-x-test-timers';

import { durationMs, fromNow } from './time';

describe('durationMs', () => {
  test.each([
    [{ value: 30, period: 'seconds' } as const, 30_000],
    [{ value: 5, period: 'minutes' } as const, 300_000],
    [{ value: 4, period: 'hours' } as const, 14_400_000],
    [{ value: 90, period: 'days' } as const, 7_776_000_000]
  ])('%o is %i ms', (duration, ms) => {
    expect(durationMs(duration)).toBe(ms);
  });
});

describe('fromNow', () => {
  test('is the duration after now', () => {
    useFakeTimers({ toFake: ['Date'], now: new Date('2026-11-23T12:00:00Z') });

    expect(fromNow({ value: 4, period: 'hours' })).toEqual(new Date('2026-11-23T16:00:00Z'));
  });
});
