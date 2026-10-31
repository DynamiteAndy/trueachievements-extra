import { compress } from 'compress-json';

interface Emoji {
  char: string;
  name: string;
  group: string;
}

// emoji.json's emojis by group, as the emoji picker lists them
const groupEmojis = (source: string) => {
  const grouped: Record<string, { char: string; name: string }[]> = {};

  for (const { char, name, group } of JSON.parse(source) as Emoji[]) {
    (grouped[group] ??= []).push({ char, name });
  }

  return Object.entries(grouped).map(([group, emojis]) => ({
    group,
    emojis
  }));
};

// The same, compressed with compress-json as the build ships them (the emoji picker decompresses them)
export const compressedEmojis = (source: string) => compress(groupEmojis(source));
