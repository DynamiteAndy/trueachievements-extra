import fs from 'fs-extra';
import { compress } from 'compress-json';

jest.mock('emoji.json', () => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const groupEmojis = require('@ta-x-build-helpers').groupEmojis;
  const emojiJson = fs.readFileSync(require.resolve('emoji.json'), 'utf8');
  /* eslint-enable @typescript-eslint/no-var-requires */

  const mappedEmojis = groupEmojis(emojiJson);
  const compressedEmojis = compress(mappedEmojis);
  return compressedEmojis;
});
