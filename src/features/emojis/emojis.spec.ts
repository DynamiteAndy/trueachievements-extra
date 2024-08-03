import fs from 'fs-extra';
import { setHtml } from '@ta-x-test';
import { emojis as config } from '@ta-x-globals';
import * as taxUtilities from '@ta-x-utilities';
import { getPath } from '@ta-x-build-helpers';
import { wait } from '@ta-x-helpers';
import emojis from '.';

vi.mock('@ta-x-utilities', async () => await vi.importActual('@ta-x-utilities'));

describe('emojis', () => {
  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');
  });

  test('should not run if not enabled', async () => {
    vi.spyOn(config, 'enabled', 'get').mockReturnValueOnce(false);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await emojis();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should not run if enabled and no emoji container is found', async () => {
    vi.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    vi.spyOn(taxUtilities, 'waitForElements').mockResolvedValueOnce(null);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await emojis();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  test.each([
    '@ta-x-test-views/emojis/thread-quick-reply.html',
    '@ta-x-test-views/emojis/thread-reply.html',
    '@ta-x-test-views/emojis/direct-message-reply.html',
    '@ta-x-test-views/emojis/add-guide.html',
    '@ta-x-test-views/emojis/guide-add-comment.html'
  ])('should run if enabled and emoji container is found', async (view: string) => {
    await setHtml(view);
    vi.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
    const spy = vi.spyOn(taxUtilities, 'allConcurrently');

    await emojis();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test.each(['@ta-x-test-views/emojis/news-article-quick-reply.html'])(
    'should run if enabled and emoji container is injected',
    async (view: string) => {
      vi.spyOn(config, 'enabled', 'get').mockReturnValueOnce(true);
      vi.spyOn(taxUtilities, 'waitForElements').mockResolvedValueOnce(null);
      const spy = vi.spyOn(taxUtilities, 'allConcurrently');

      await emojis();

      const parsedDocument = new DOMParser().parseFromString(fs.readFileSync(getPath(view), 'utf8'), 'text/html');
      document.body.appendChild(parsedDocument.body.firstElementChild);

      await wait(1);

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    }
  );
});
