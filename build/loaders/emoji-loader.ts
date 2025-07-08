import type { LoaderContext } from '@rspack/core';
import { compress } from 'compress-json';
import groupEmojis from '../helpers/group-emojis.ts';

export interface EmojiLoaderOptions {
  compress?: boolean;
}

export default function emojiLoader(
  this: LoaderContext<EmojiLoaderOptions>,
  source: string
): string {
  try {
    const { compress: shouldCompress = false } = this.getOptions() ?? {};

    const groupedEmojis = groupEmojis(source);
    const result = shouldCompress ? compress(groupedEmojis) : groupedEmojis;

    return `export default ${JSON.stringify(result)};`;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    this.emitError(new Error(`[emoji-loader] ${err.message}`));

    return `export default {};`;
  }
}