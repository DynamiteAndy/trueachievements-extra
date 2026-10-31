import { logger, LogLevel } from './logger';
import { timed } from './timed';

describe('timed', () => {
  test('runs the work and hands back its result', () => {
    expect(timed('Sum', () => 1 + 2)).toBe(3);
  });

  test('measures the work on the performance timeline only while debug logging is on', () => {
    const measure = vi.spyOn(performance, 'measure');

    timed('Quiet', () => 'a');
    logger.setLevel(LogLevel.Debug);
    onTestFinished(() => logger.setLevel(LogLevel.Warn));
    timed('Thread filter', () => 'b');

    expect(measure.mock.calls).toEqual([
      ['ta-x Thread filter', { start: expect.any(Number), end: expect.any(Number) }]
    ]);
  });

  // A failure still shows how long it took, and still reaches the caller
  test('measures work that throws, and throws it on', () => {
    const measure = vi.spyOn(performance, 'measure');
    logger.setLevel(LogLevel.Debug);
    onTestFinished(() => logger.setLevel(LogLevel.Warn));

    expect(() =>
      timed('Broken', () => {
        throw new Error('broke');
      })
    ).toThrow('broke');
    expect(measure).toHaveBeenCalledOnce();
  });

  test('measures work that returns a promise once it settles, and hands back that promise', async () => {
    const measure = vi.spyOn(performance, 'measure');
    logger.setLevel(LogLevel.Debug);
    onTestFinished(() => logger.setLevel(LogLevel.Warn));
    const { promise, resolve } = Promise.withResolvers<string>();

    const result = timed('Load', () => promise);

    expect(result).toBe(promise);
    expect(measure).not.toHaveBeenCalled();
    resolve('loaded');
    expect(await result).toBe('loaded');
    expect(measure).toHaveBeenCalledOnce();
  });

  // A rejection reaches the caller as it is, and is measured too
  test('measures a promise that rejects, and leaves the rejection to the caller', async () => {
    const measure = vi.spyOn(performance, 'measure');
    logger.setLevel(LogLevel.Debug);
    onTestFinished(() => logger.setLevel(LogLevel.Warn));

    await expect(timed('Load', () => Promise.reject(new Error('unread')))).rejects.toThrow('unread');
    expect(measure).toHaveBeenCalledOnce();
  });
});
