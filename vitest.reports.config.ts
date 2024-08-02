import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        enabled: true,
        reporter: ['html'],
        include: ['src/**']
      },
      silent: true,
      reporters: ['html'],
      watch: true
    }
  })
);
