import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config.mts';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        enabled: true,
        reporter: ['lcov'],
        include: ['src/**'],
        exclude: [
          '**/*.hbs',
          '**/*.html',
          '**/*.scss',
          'node_modules/**',
        ]
      },
      reporters: ['default', 'github-actions']
    }
  })
);
