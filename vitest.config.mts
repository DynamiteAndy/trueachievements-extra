import { defineConfig } from 'vitest/config';
import webTransfrom from './test/plugins/web.ts';
import emojiJsonTransfrom from './test/plugins/emoji-json.ts';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    root: '.',
    include: ['./src/**/*.spec.ts'],
    globals: true,
    watch: false,
    environment: 'happy-dom',
    execArgv: ['--no-webstorage']
  },
  plugins: [webTransfrom(), emojiJsonTransfrom()]
});
