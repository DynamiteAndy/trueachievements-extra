import each from 'jest-each';
import fs from 'fs-extra';
import { setHtml } from '@ta-x-jest';
import { emojis as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import { getPath } from '@ta-x-build-helpers';
import { wait } from '@ta-x-helpers';
import emojis from '.';

jest.mock('@ta-x-utilities', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@ta-x-utilities')
  };
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
    jest.spyOn(taxUtilities, 'waitForElements').mockResolvedValueOnce(null);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await emojis();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  each([
    '@ta-x-jest-views/emojis/thread-quick-reply.html',
    '@ta-x-jest-views/emojis/thread-reply.html',
    '@ta-x-jest-views/emojis/direct-message-reply.html',
    '@ta-x-jest-views/emojis/add-guide.html',
    '@ta-x-jest-views/emojis/guide-add-comment.html'
  ]).test('should run if enabled and emoji container is found', async (view: string) => {
    setHtml(view);
    jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    const spy = jest.spyOn(taxUtilities, 'allConcurrently');

    await emojis();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  each(['@ta-x-jest-views/emojis/news-article-quick-reply.html']).test(
    'should run if enabled and emoji container is injected',
    async (view: string) => {
      jest.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
      jest.spyOn(taxUtilities, 'waitForElements').mockResolvedValueOnce(null);
      const spy = jest.spyOn(taxUtilities, 'allConcurrently');

      await emojis();

      const parsedDocument = new DOMParser().parseFromString(fs.readFileSync(getPath(view), 'utf8'), 'text/html');
      document.body.appendChild(parsedDocument.body.firstElementChild);

      await wait(1);

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    }
  );
});
