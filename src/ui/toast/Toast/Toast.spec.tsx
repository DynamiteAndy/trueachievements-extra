import { find, mountForTest, readFixtureDocument, required, setHtml, useFakeTimers } from '@ta-x-test';
import { act } from 'preact/test-utils';

import type { MountedRoot } from '@ta-x-page';

import styles from '../styles';
import { showToast } from '../toast-message';

import { DEFAULT_TIMEOUT_MS, FADE_MS, Toast, type ToastMessage } from './Toast';

describe('Toast', () => {
  let root: MountedRoot;

  // The site's own toast, captured from /games.aspx.
  const siteToast = (): { wrap: Element; single: Element; heading: Element } => {
    const wrap = find('.jq-toast-wrap', readFixtureDocument('@ta-x-test-views/site-toast/game-added.html'));

    return { wrap, single: find('.jq-toast-single', wrap), heading: find('h2', wrap) };
  };

  const toast = (): HTMLElement | null => required(root.element).querySelector('.jq-toast-single');
  const show = async (message: ToastMessage): Promise<void> => {
    await act(() => showToast(message));
  };
  // Mounted for the test, and unmounted when it ends
  const mountToast = async (): Promise<void> => {
    // act() flushes the first render's effects (Preact runs effects after paint).
    await act(() => {
      root = mountForTest(<Toast />, document.body);
    });
  };
  const advance = async (ms: number): Promise<void> => {
    await act(() => {
      vi.advanceTimersByTime(ms);
    });
  };

  beforeEach(async () => {
    useFakeTimers();
    setHtml('@ta-x-test-views/empty.html');
    await mountToast();
  });

  test('should render an empty toast wrapper with the site classes and its style class', () => {
    const { wrap } = siteToast();

    // The site's own toast wrapper, and our hook
    expect([...required(root.element).classList]).toEqual([...wrap.classList, styles.toast]);
    expect(required(root.element).getAttribute('role')).toBe('status');
    expect(toast()).toBeNull();
  });

  test('should show a message with the same markup and classes as the site toast', async () => {
    const { single, heading } = siteToast();

    await show({ text: 'Game added to collection', type: 'success' });
    await advance(50);

    expect([...required(toast()).classList].sort()).toEqual([...single.classList].sort());
    expect(find('h2', toast()).className).toBe(heading.className);
    expect(find('h2', toast()).textContent).toBe(heading.textContent);
  });

  test.each(['info', 'success', 'warning', 'danger'] as const)('should use the site style-%s class', async (type) => {
    await show({ text: 'Message', type });

    expect(required(toast())).toHaveExactClasses(['jq-toast-single', `style-${type}`, 'fade']);
  });

  test('should fade in from the faded-out state', async () => {
    await show({ text: 'Message', type: 'success' });

    expect(required(toast())).toHaveExactClasses(['jq-toast-single', 'style-success', 'fade']);

    await advance(50);

    expect(required(toast())).toHaveExactClasses(['jq-toast-single', 'style-success', 'fade', 'fade-in']);
  });

  test('should fade out after the default timeout and then remove the message', async () => {
    await show({ text: 'Message', type: 'success' });
    await advance(DEFAULT_TIMEOUT_MS);

    expect(required(toast())).toHaveExactClasses(['jq-toast-single', 'style-success', 'fade']);

    await advance(FADE_MS);

    expect(toast()).toBeNull();
  });

  // A link in it (the giveaway's game) can then be reached and read: it waits its full time again once let go
  test('should stay while hovered or holding the focus, then leave after its timeout', async () => {
    await show({ text: <a href="/game/x">Game</a>, type: 'success' });
    const wrap = required(root.element);

    await act(() => {
      wrap.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, relatedTarget: document.body }));
      wrap.dispatchEvent(new MouseEvent('mouseenter'));
    });
    await advance(DEFAULT_TIMEOUT_MS + FADE_MS);
    expect(toast()).not.toBeNull();

    await act(() => {
      wrap.dispatchEvent(new MouseEvent('mouseleave'));
      find('a', wrap).focus();
    });
    await advance(DEFAULT_TIMEOUT_MS + FADE_MS);
    expect(toast()).not.toBeNull();

    await act(() => find('a', wrap).blur());
    await advance(DEFAULT_TIMEOUT_MS - 1);
    expect(toast()).not.toBeNull();
    await advance(1 + FADE_MS);
    expect(toast()).toBeNull();
  });

  test('should come back when held while fading out', async () => {
    await show({ text: 'Message', type: 'success' });
    await advance(DEFAULT_TIMEOUT_MS);
    expect(required(toast())).toHaveExactClasses(['jq-toast-single', 'style-success', 'fade']);

    await act(() => {
      required(root.element).dispatchEvent(new MouseEvent('mouseenter'));
    });
    await advance(FADE_MS);

    expect(required(toast())).toHaveExactClasses(['jq-toast-single', 'style-success', 'fade', 'fade-in']);
  });

  test('should use a custom timeout', async () => {
    await show({ text: 'Message', type: 'success', timeoutMs: 5000 });
    await advance(DEFAULT_TIMEOUT_MS + FADE_MS);

    expect(required(toast())).toHaveExactClasses(['jq-toast-single', 'style-success', 'fade', 'fade-in']);

    await advance(5000 - DEFAULT_TIMEOUT_MS);

    expect(toast()).toBeNull();
  });

  test('should replace the current message and restart its timeout', async () => {
    await show({ text: 'First', type: 'success' });
    await advance(DEFAULT_TIMEOUT_MS - 100);
    await show({ text: 'Second', type: 'danger' });
    await advance(200);

    expect(required(root.element).querySelectorAll('.jq-toast-single')).toHaveLength(1);
    expect(required(toast()).textContent).toBe('Second');
    expect(required(toast())).toHaveExactClasses(['jq-toast-single', 'style-danger', 'fade', 'fade-in']);

    await advance(DEFAULT_TIMEOUT_MS + FADE_MS);

    expect(toast()).toBeNull();
  });

  test('should render rich content such as links', async () => {
    await show({
      text: (
        <>
          Entered giveaway for <a href="/game/Halo-Infinite/achievements">Halo Infinite</a>.
        </>
      ),
      type: 'success'
    });

    const link = find('h2 a', toast());
    expect(link.getAttribute('href')).toBe('/game/Halo-Infinite/achievements');
    expect(find('h2', toast()).textContent).toBe('Entered giveaway for Halo Infinite.');
  });

  test('should show the same message twice', async () => {
    await show({ text: 'Autosave successful.', type: 'success' });
    await advance(DEFAULT_TIMEOUT_MS + FADE_MS);
    expect(toast()).toBeNull();

    await show({ text: 'Autosave successful.', type: 'success' });

    expect(required(toast()).textContent).toBe('Autosave successful.');
  });

  test('should show a message set before it was mounted', async () => {
    await act(() => root.unmount());
    showToast({ text: 'Early', type: 'info' });

    await mountToast();

    expect(required(toast()).textContent).toBe('Early');
  });

  test('should stop showing messages once unmounted', async () => {
    // Shown while mounted, so the check below isn't passing for a component that never shows anything
    await show({ text: 'First', type: 'success' });
    expect(required(toast()).textContent).toBe('First');

    await act(() => root.unmount());
    await show({ text: 'Second', type: 'success' });

    expect(document.querySelector('.jq-toast-single')).toBeNull();
    expect(document.body.textContent).not.toContain('Second');
  });
});
