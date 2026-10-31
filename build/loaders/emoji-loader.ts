import { compressedEmojis } from '../helpers/group-emojis.ts';

// emoji.json as the emoji picker's groups, compressed (the picker decompresses them)
export default function emojiLoader(source: string): string {
  return `export default ${JSON.stringify(compressedEmojis(source))};`;
}
