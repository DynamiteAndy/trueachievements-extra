import path from 'node:path';
import fs from 'node:fs';
import { compress } from 'compress-json';
import groupEmojis from '../../build/helpers/group-emojis.ts';

export default () => {
  const emojiJsonModule = 'emoji.json';
  const resolvedVirtualEmojiJsonModule = `\0${emojiJsonModule}`;

  return {
    name: 'vitest-emoji-json',
    enforce: 'pre',

    resolveId(id: string) {
      if (id.endsWith(emojiJsonModule)) {
        return resolvedVirtualEmojiJsonModule;
      }
    },
    load(id: string) {
      if (id === resolvedVirtualEmojiJsonModule) {
        const emojis = fs.readFileSync(path.resolve('node_modules/emoji.json/emoji.json'), 'utf-8');
        const mappedEmojis = groupEmojis(emojis);
        const compressedEmojis = compress(mappedEmojis);

        return JSON.stringify(compressedEmojis);
      }
    }
  };
};
