import sheet from '@ta-x-scss/index.scss';
import { find, mountInPage, renderElement, required } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { YouTubeVideo } from './YouTubeVideo';

describe('game/extra-guides/YouTubeVideo', () => {
  test("renders the video as the site's lazyYT plugin does: its thumbnail through the site's proxy, with YouTube's play button", () => {
    const video = renderElement(<YouTubeVideo id="mG32M23MnRQ" />);

    // As the site renders a walkthrough's video (Gears of War 4, page 3)
    expect(video.className).toBe('lazyYT lazyYT-container');
    expect(video.getAttribute('data-youtube-id')).toBe('mG32M23MnRQ');
    expect(video.style.paddingBottom).toBe('56.25%');
    const thumbnail = find('.ytp-thumbnail', video);
    expect(thumbnail.className).toBe('ytp-thumbnail lazyYT-image-loaded');
    expect(find('button', thumbnail).className).toBe('ytp-large-play-button ytp-button');
    expect(find('button', thumbnail).getAttribute('aria-label')).toBe('Play video');
    // Not a submit: the site's form wraps the page
    expect(find('button', thumbnail).getAttribute('type')).toBe('button');
    expect(find('img', thumbnail).getAttribute('src')).toBe(
      'https://ip.trueachievements.com/remote/img.youtube.com%2Fvi%2FmG32M23MnRQ%2Fhqdefault.jpg?width=640'
    );
    // YouTube isn't reached until it's played
    expect(video.querySelector('iframe')).toBeNull();
  });

  // The keyboard's way in: Enter or Space on the focused play button clicks it (the browser's, for a real button)
  test('plays the video when its play button is clicked', async () => {
    const video = mountInPage(<YouTubeVideo id="mG32M23MnRQ" />).root.element;

    await act(() => find<HTMLElement>('.ytp-thumbnail button', video).click());

    expect(find('iframe', video).getAttribute('src')).toBe(
      'https://www.youtube.com/embed/mG32M23MnRQ?rel=0&autoplay=1'
    );
  });

  // The player replaces the focused button: focus would otherwise drop to the page
  test('moves focus on to the player when started from the focused play button, and leaves it when clicked', async () => {
    const byKeyboard = mountInPage(<YouTubeVideo id="mG32M23MnRQ" />).root.element;
    const button = find<HTMLElement>('.ytp-thumbnail button', byKeyboard);
    button.focus();
    await act(() => button.click());
    expect(document.activeElement).toBe(find('iframe', byKeyboard));

    (document.activeElement as HTMLElement | null)?.blur();
    const byMouse = mountInPage(<YouTubeVideo id="mG32M23MnRQ" />).root.element;
    await act(() => find<HTMLElement>('.ytp-thumbnail', byMouse).click());
    expect(document.activeElement).not.toBe(find('iframe', byMouse));
  });

  test("plays the video in YouTube's player once its thumbnail is clicked", async () => {
    const video = mountInPage(<YouTubeVideo id="mG32M23MnRQ" />).root.element;

    await act(() => find<HTMLElement>('.ytp-thumbnail', video).click());

    expect(required(video).className).toBe('lazyYT lazyYT-container lazyYT-video-loaded');
    expect(required(video).querySelector('.ytp-thumbnail')).toBeNull();
    expect(find('iframe', video).getAttribute('src')).toBe(
      'https://www.youtube.com/embed/mG32M23MnRQ?rel=0&autoplay=1'
    );
  });

  // The site's copied style takes the ring away; ours puts one back on our guides' videos only, from the keyboard only
  test("has a keyboard focus ring on our guides' play button, leaving the site's own videos alone", () => {
    // As lightningcss writes it, compared without spaces
    const css = sheet.replace(/\s+/g, '');

    expect(css).toContain('.ta-x-achievement-guide.ytp-button:focus-visible{outline-offset:-4px;outline:2pxsolid#fff}');
    // Never unscoped, which would ring the site's own videos too
    expect(css).not.toMatch(/(^|[},])\.ytp-button:focus-visible/);
  });
});
