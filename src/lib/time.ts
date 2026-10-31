// A length of time, as the stores' expiries and the fetch cache's `deleteAfter` give it
export interface Duration {
  value: number;
  period: 'seconds' | 'minutes' | 'hours' | 'days';
}

const periods = { seconds: 1_000, minutes: 60_000, hours: 3_600_000, days: 86_400_000 };

// The duration in milliseconds
export const durationMs = ({ value, period }: Duration): number => value * periods[period];

// The moment the duration from now: when a stored entry expires
export const fromNow = (duration: Duration): Date => new Date(Date.now() + durationMs(duration));
