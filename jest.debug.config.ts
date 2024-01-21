import type { JestConfigWithTsJest } from 'ts-jest';
import baseConfig from './jest.config';

const config: JestConfigWithTsJest = Object.assign(baseConfig, {
  detectLeaks: true,
  detectOpenHandles: true,
  reporters: ['default']
} as JestConfigWithTsJest);

export default config;
