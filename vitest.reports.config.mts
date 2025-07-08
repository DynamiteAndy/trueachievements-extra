import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config.mts';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        enabled: true,
        reporter: ['html'],
        include: ['src/**'],
        reportsDirectory: './dist/html/coverage/',
        exclude: [
          '**/*.hbs',
          '**/*.html',
          '**/*.scss',
          'node_modules/**',
        ]
      },
      silent: true,
      reporters: ['html'],
      watch: true,
      outputFile: './dist/html/index.html'
    }
  })
);
