import { logger, LogLevel } from './logger-service';

describe('LoggerService', () => {
  const originalConsole = { ...console };

  beforeEach(() => {
    console.debug = vi.fn();
    console.log = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
  });

  afterEach(() => {
    logger.setLevel(LogLevel.Warn);
    Object.assign(console, originalConsole);
  });

  test('defaults to Warn, so debug and info are dropped but warn and error reach the console', () => {
    logger.debug('scope', 'debug message');
    logger.info('scope', 'info message');
    logger.warn('scope', 'warn message');
    logger.error('scope', 'error message');

    expect(console.debug).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith('%c[scope]', expect.any(String), 'warn message');
    expect(console.error).toHaveBeenCalledWith('%c[scope]', expect.any(String), 'error message');
  });

  test('setLevel lowers the threshold so more verbose calls reach the console', () => {
    logger.setLevel(LogLevel.Debug);

    logger.debug('scope', 'debug message');
    logger.info('scope', 'info message');

    expect(console.debug).toHaveBeenCalledWith('%c[scope]', expect.any(String), 'debug message');
    expect(console.log).toHaveBeenCalledWith('%c[scope]', expect.any(String), 'info message');
  });

  test('setLevel raises the threshold so less severe calls are dropped', () => {
    logger.setLevel(LogLevel.Error);

    logger.warn('scope', 'warn message');
    logger.error('scope', 'error message');

    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('%c[scope]', expect.any(String), 'error message');
  });

  test('Silent drops every level, including error', () => {
    logger.setLevel(LogLevel.Silent);

    logger.error('scope', 'error message');

    expect(console.error).not.toHaveBeenCalled();
  });

  test('getLevel reflects the current threshold', () => {
    logger.setLevel(LogLevel.Info);

    expect(logger.getLevel()).toBe(LogLevel.Info);
  });

  test('forwards multiple arguments after the scope prefix and style', () => {
    logger.setLevel(LogLevel.Debug);
    const error = new Error('boom');

    logger.debug('scope', 'message', error, { extra: true });

    expect(console.debug).toHaveBeenCalledWith('%c[scope]', expect.any(String), 'message', error, { extra: true });
  });

  test('each level is styled with a different color', () => {
    logger.setLevel(LogLevel.Debug);

    logger.debug('scope', 'message');
    logger.info('scope', 'message');
    logger.warn('scope', 'message');
    logger.error('scope', 'message');

    const styles = [
      (console.debug as ReturnType<typeof vi.fn>).mock.calls[0][1],
      (console.log as ReturnType<typeof vi.fn>).mock.calls[0][1],
      (console.warn as ReturnType<typeof vi.fn>).mock.calls[0][1],
      (console.error as ReturnType<typeof vi.fn>).mock.calls[0][1]
    ];

    expect(new Set(styles).size).toBe(styles.length);
  });
});
