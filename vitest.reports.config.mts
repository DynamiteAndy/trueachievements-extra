import { defineConfig, mergeConfig } from 'vitest/config';

import baseConfig from './vitest.config.mts';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        enabled: true,
        reporter: ['html'],
        reportsDirectory: './dist/html/coverage/'
      },
      silent: true,
      // The default reporter prints the UI's address with its token (Vitest 5 asks for it: without, the UI answers
      // 403). The HTML report goes to dist/html (Vitest 5's html reporter takes `outputDir`; it ignores `outputFile`)
      reporters: ['default', ['html', { outputDir: './dist/html' }]],
      watch: true
    }
  })
);
