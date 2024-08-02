import emojis from 'emoji.json';
import { compress } from 'compress-json';
import { groupEmojis } from '../../build/helpers';

export default () => {
  const emojiJsonModule = 'emoji.json';
  const resolvedVirtualEmojiJsonModule = '\0' + emojiJsonModule;

  return {
    name: 'vitest-emoji-json',

    resolveId(id: string) {
      if (id.endsWith(emojiJsonModule)) {
        return resolvedVirtualEmojiJsonModule;
      }
    },
    load(id: string) {
      if (id === resolvedVirtualEmojiJsonModule) {
        const mappedEmojis = groupEmojis(JSON.stringify(emojis));
        const compressedEmojis = compress(mappedEmojis);

        return JSON.stringify(compressedEmojis);
      }
    }
  };
};
