import type { JestConfigWithTsJest } from 'ts-jest';
import baseConfig from './jest.config';

const config: JestConfigWithTsJest = Object.assign(baseConfig, {
  coverageDirectory: '<rootDir>/jest-reports/coverage-report',
  coverageReporters: ['html-spa'],
  reporters: [
    'jest-progress-bar-reporter',
    [
      'jest-html-reporters',
      {
        darkTheme: true,
        publicPath: './jest-reports/test-report',
        filename: 'report.html',
        pageTitle: 'TrueAchievements Extra Test Report'
      }
    ]
  ]
} as JestConfigWithTsJest);

export default config;
