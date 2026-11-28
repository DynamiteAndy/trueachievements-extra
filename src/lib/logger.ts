/**
 * Central place for the userscript's own diagnostic output. A single shared instance so any
 * module can log without wiring its own console wrapper, with a global threshold that decides
 * what actually reaches the console -- each call site picks its own verbosity (`debug` through
 * `error`) by which method it calls, and anything below the current threshold is dropped before
 * it touches `console`.
 *
 * Only usable from code that runs in the userscript's own module scope. Code built as a string
 * and run in the page as a page function (`createPageScript`, page/page-script.ts) executes
 * in a different JS realm and has no access to this module -- those keep using `console.*` directly.
 */

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
  Silent = 4
}

const CONSOLE_METHOD = {
  [LogLevel.Debug]: 'debug',
  [LogLevel.Info]: 'log',
  [LogLevel.Warn]: 'warn',
  [LogLevel.Error]: 'error'
} as const satisfies Partial<Record<LogLevel, 'debug' | 'log' | 'warn' | 'error'>>;

const SCOPE_STYLE = {
  [LogLevel.Debug]: 'color: #6b7280; font-weight: bold',
  [LogLevel.Info]: 'color: #2563eb; font-weight: bold',
  [LogLevel.Warn]: 'color: #d97706; font-weight: bold',
  [LogLevel.Error]: 'color: #dc2626; font-weight: bold'
} as const satisfies Partial<Record<LogLevel, string>>;

class LoggerServiceImpl {
  private level: LogLevel = LogLevel.Warn;

  /** Sets the minimum level that reaches the console. Anything below it is dropped. */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  debug(scope: string, ...args: unknown[]): void {
    this.write(LogLevel.Debug, scope, args);
  }

  info(scope: string, ...args: unknown[]): void {
    this.write(LogLevel.Info, scope, args);
  }

  warn(scope: string, ...args: unknown[]): void {
    this.write(LogLevel.Warn, scope, args);
  }

  error(scope: string, ...args: unknown[]): void {
    this.write(LogLevel.Error, scope, args);
  }

  private write(level: Exclude<LogLevel, LogLevel.Silent>, scope: string, args: unknown[]): void {
    if (level < this.level) {
      return;
    }

    console[CONSOLE_METHOD[level]](`%c[${scope}]`, SCOPE_STYLE[level], ...args);
  }
}

export const logger = new LoggerServiceImpl();
