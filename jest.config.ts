import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: JestConfigWithTsJest = {
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  coverageReporters: ['none'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/build', '<rootDir>/test'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src', useESM: true }),
  setupFilesAfterEnv: ['<rootDir>/test/jest/setup/emoji.setup.ts'],
  transform: {
    '^.+\\.html$': '<rootDir>/test/transformers/html.ts',
    '^.+\\.hbs$': '<rootDir>/test/transformers/hbs.ts',
    '^.+\\.scss$': '<rootDir>/test/transformers/scss.ts',
    '^.+\\.ts$': '@swc/jest'
  }
};

export default config;
