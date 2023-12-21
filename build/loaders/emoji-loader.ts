import type { LoaderContext } from 'webpack';
import { compress } from 'compress-json';

interface EmojiLoaderOptions {
  compress: boolean;
}

export default function (this: LoaderContext<EmojiLoaderOptions>, source: string) {
  const options = this.getOptions();
  let emojis = JSON.parse(source);

  emojis = emojis.map((emoji: { char: string; name: string; group: string }) => ({
    char: emoji.char,
    name: emoji.name,
    group: emoji.group
  }));

  // emojis = emojis.reduce(
  //   (accumulator, emoji: { char: string; name: string; group: string }) => {
  //     let category = accumulator.get(emoji.group);
  //     if (!category) {
  //       category = [];
  //       accumulator.set(emoji.group, category);
  //     }

  //     category.push({ char: emoji.char, name: emoji.name });

  //     return accumulator;
  //   },
  //   new Map([['TrueAchievements', []]])
  // );

  if (options.compress) {
    emojis = compress(emojis);
  }

  return JSON.stringify(emojis);
}
