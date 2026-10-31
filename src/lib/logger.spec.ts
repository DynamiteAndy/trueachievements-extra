import { logger, LogLevel } from './logger';

describe('LoggerService', () => {
  // The style of each level's scope prefix
  const debugStyle = 'color: #6b7280; font-weight: bold';
  const infoStyle = 'color: #2563eb; font-weight: bold';
  const warnStyle = 'color: #d97706; font-weight: bold';
  const errorStyle = 'color: #dc2626; font-weight: bold';

  // The console's methods, silenced (restoreMocks puts them back)
  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logger.setLevel(LogLevel.Warn);
  });

  test('defaults to Warn, so debug and info are dropped but warn and error reach the console', () => {
    logger.debug('scope', 'debug message');
    logger.info('scope', 'info message');
    logger.warn('scope', 'warn message');
    logger.error('scope', 'error message');

    expect(console.debug).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledExactlyOnceWith('%c[scope]', warnStyle, 'warn message');
    expect(console.error).toHaveBeenCalledExactlyOnceWith('%c[scope]', errorStyle, 'error message');
  });

  test('setLevel lowers the threshold so more verbose calls reach the console', () => {
    logger.setLevel(LogLevel.Debug);

    logger.debug('scope', 'debug message');
    logger.info('scope', 'info message');

    expect(console.debug).toHaveBeenCalledExactlyOnceWith('%c[scope]', debugStyle, 'debug message');
    expect(console.log).toHaveBeenCalledExactlyOnceWith('%c[scope]', infoStyle, 'info message');
  });

  test('setLevel raises the threshold so less severe calls are dropped', () => {
    logger.setLevel(LogLevel.Error);

    logger.warn('scope', 'warn message');
    logger.error('scope', 'error message');

    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledExactlyOnceWith('%c[scope]', errorStyle, 'error message');
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

    expect(console.debug).toHaveBeenCalledExactlyOnceWith('%c[scope]', debugStyle, 'message', error, {
      extra: true
    });
  });
});
