import each from 'jest-each';
import fs from 'fs-extra';
import { setHtml } from '@ta-x-jest';
import { emojis as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import emojis from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
});

jest.mock('emoji.json', () => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const compress = require('compress-json').compress;
  const emojiJson = JSON.parse(fs.readFileSync(require.resolve('emoji.json'), 'utf8'));
  /* eslint-enable @typescript-eslint/no-var-requires */

  const mappedEmojis = emojiJson.map((emoji: { char: string; name: string; group: string }) => ({
    char: emoji.char,
    name: emoji.name,
    group: emoji.group
  }));

  // const mappedEmojis = emojiJson.reduce(
  //   (accumulator, emoji: { char: string; name: string; group: string }) => {
  //     let category = accumulator.get(emoji.group);
  //     if (!category) {
  //       category = [];
  //       accumulator.set(emoji.group, category);
  //     }

  //     category.push(emoji);

  //     return accumulator;
  //   },
  //   new Map([['TrueAchievements', []]])
  // );

  const compressedEmojis = compress(mappedEmojis);
  return compressedEmojis;
});

describe('emojis', () => {
  beforeEach(() => {
    setHtml('@ta-x-jest-views/empty.html');
  });

  it('should not run if not enabled', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(false);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await emojis();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should not run if enabled and no emoji container is found', async () => {
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    jest.spyOn(taxUtilities, 'waitForElement').mockResolvedValueOnce(null);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await emojis();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  each([
    '@ta-x-jest-views/emojis/news-article-quick-reply.html',
    '@ta-x-jest-views/emojis/direct-message-reply.html',
    '@ta-x-jest-views/emojis/add-guide.html'
  ]).test(
    'should run if enabled and emoji container is found',
    async (view: string) => {
      setHtml(view);
      jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
      const spy = jest.spyOn(taxUtilities, 'allConcurrently');

      await emojis();

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    },
    30000
  );
});
