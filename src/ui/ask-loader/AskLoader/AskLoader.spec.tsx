import { find, mountForTest, renderElement, required, submitAsk } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { hideClass } from '../../constants';
import attributes from '../attributes';
import styles from '../styles';

import { AskLoader } from './AskLoader';

describe('ui/ask-loader/AskLoader', () => {
  const ask = { label: 'Walkthrough Id', info: 'Please enter the walkthrough id.' };
  const form = (container: Element) => container.querySelector(`.${styles.askLoaderAsk}`);

  test("renders a container with its style class and the feature's, a loader and a hidden ask form", () => {
    const container = renderElement(<AskLoader class="js-ta-x-feature ta-x-feature" ask={ask} />);

    expect(container.tagName).toBe('DIV');
    expect([...container.classList]).toEqual([styles.askLoaderContainer, 'js-ta-x-feature', 'ta-x-feature']);
    expect([...find(`.${styles.articleLoader}`, container).children].map((child) => child.tagName)).toEqual([
      'P',
      'svg'
    ]);
    expect(required(form(container))).toHaveExactClasses([styles.askLoaderAsk, hideClass]);
    expect(container.querySelector('article, section')).toBeNull();
  });

  test('has no ask form when the feature never asks', () => {
    const container = renderElement(<AskLoader status="loaded" />);

    expect(form(container)).toBeNull();
    expect(container.getAttribute(attributes.askContentLoaded)).toBe('true');
  });

  test.each([
    { status: 'loading', loaded: null, loader: true, askHidden: true, content: false },
    { status: 'ask', loaded: 'true', loader: false, askHidden: false, content: false },
    { status: 'loaded', loaded: 'true', loader: false, askHidden: true, content: true }
  ] as const)('shows what the $status status needs', ({ status, loaded, loader, askHidden, content }) => {
    const container = renderElement(
      <AskLoader status={status} ask={ask}>
        <div class="content" />
      </AskLoader>
    );

    expect(container.getAttribute(attributes.askContentLoaded)).toBe(loaded);
    expect(container.querySelector(`.${styles.articleLoader}`) !== null).toBe(loader);
    expect(required(form(container))).toHaveExactClasses([styles.askLoaderAsk, ...(askHidden ? [hideClass] : [])]);
    expect(container.querySelector(':scope > .content') !== null).toBe(content);
  });

  test('switches status in place when re-rendered, keeping what was typed', () => {
    const root = mountForTest(<AskLoader status="ask" ask={ask} />, document.body);
    const container = root.element;
    find<HTMLInputElement>('input[type="text"]', container).value = '4138';

    root.render(<AskLoader status="loading" ask={ask} />);
    root.render(<AskLoader status="ask" ask={ask} />);

    expect(root.element).toBe(container);
    expect(find<HTMLInputElement>('input[type="text"]', container).value).toBe('4138');
  });

  describe('a save that looks up what was typed (onSubmit returning a promise)', () => {
    const loading = (container: Element) => container.querySelector(`.${styles.articleLoader}`) !== null;
    const askShown = (container: Element) => !required(form(container)).classList.contains(hideClass);
    const save = (container: Element) => submitAsk(container, '4138');
    // A lookup the spec settles: resolve() or reject()
    const lookUp = () => Promise.withResolvers<void>();

    test('shows the loader while it runs, then the content the feature found', async () => {
      const { promise, resolve } = lookUp();
      const onSubmit = vi.fn(() => promise);
      const root = mountForTest(<AskLoader status="ask" ask={{ ...ask, onSubmit }} />, document.body);
      const container = root.element;

      save(required(container));

      expect(onSubmit).toHaveBeenCalledExactlyOnceWith('4138');
      expect(loading(required(container))).toBe(true);
      expect(askShown(required(container))).toBe(false);

      // The feature finds what it needs and re-renders loaded
      await act(async () => {
        root.render(
          <AskLoader status="loaded" ask={{ ...ask, onSubmit }}>
            <p class="found">Found</p>
          </AskLoader>
        );
        resolve();
        await promise;
      });

      expect(loading(required(container))).toBe(false);
      expect(find('.found', container).textContent).toBe('Found');
    });

    test("shows the form again when the feature doesn't find anything", async () => {
      const { promise, resolve } = lookUp();
      const root = mountForTest(<AskLoader status="ask" ask={{ ...ask, onSubmit: () => promise }} />, document.body);

      save(required(root.element));
      await act(async () => {
        resolve();
        await promise;
      });

      expect(loading(required(root.element))).toBe(false);
      expect(askShown(required(root.element))).toBe(true);
    });

    test("shows the form again when the lookup fails (e.g. a page that didn't load), rather than the loader for good", async () => {
      const { promise, reject } = lookUp();
      const root = mountForTest(<AskLoader status="ask" ask={{ ...ask, onSubmit: () => promise }} />, document.body);

      save(required(root.element));
      await act(async () => {
        reject(new Response('', { status: 404 }));
        await promise.catch(() => undefined);
      });

      expect(loading(required(root.element))).toBe(false);
      expect(askShown(required(root.element))).toBe(true);
    });
  });
});
