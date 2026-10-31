import fs from 'node:fs';
import { createRequire } from 'node:module';

import { compressedEmojis } from '../../build/helpers/group-emojis.ts';

// The emoji.json package compressed as build/loaders/emoji-loader.ts does it for the build
export default () => {
  const emojiJsonModule = 'emoji.json';
  const resolvedVirtualEmojiJsonModule = `\0${emojiJsonModule}`;

  return {
    name: 'vitest-emoji-json',
    enforce: 'pre' as const,

    resolveId(id: string) {
      if (id === emojiJsonModule) {
        return resolvedVirtualEmojiJsonModule;
      }
    },
    load(id: string) {
      if (id === resolvedVirtualEmojiJsonModule) {
        const emojis = fs.readFileSync(createRequire(import.meta.url).resolve(emojiJsonModule), 'utf-8');
        return JSON.stringify(compressedEmojis(emojis));
      }
    }
  };
};
