import type { JestConfigWithTsJest } from 'ts-jest';
import baseConfig from './jest.config';

const config: JestConfigWithTsJest = Object.assign(baseConfig, {
  collectCoverage: true,
  coverageReporters: ['lcov'],
  logHeapUsage: true,
  reporters: ['default', 'github-actions']
} as JestConfigWithTsJest);

export default config;
