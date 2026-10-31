import { find, mountForTest, readFixtureDocument, required, setHtml } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { guideSites } from '../guide-sites';

import { ImportedSolutions } from './ImportedSolutions';

describe('game/extra-guides/ImportedSolutions', () => {
  const solution = {
    site: guideSites[0],
    guide: {
      url: 'https://www.xboxachievements.com/game/g-force/guide/',
      guide: {
        title: 'Combat Veteran',
        href: 'https://www.xboxachievements.com/game/g-force/guide/#combat',
        guide: '<p>A guide</p>'
      }
    }
  };

  // The site's own heading on an achievement page that has solutions
  const siteHeading = (): Element => {
    return find('#oSolutions', readFixtureDocument('@ta-x-test-views/achievement-page/with-solutions.html'));
  };

  test("adds the site's solutions heading and list where the site puts them (after #divDynLb) when it has none", async () => {
    setHtml('@ta-x-test-views/achievement-page/no-solutions.html');

    await act(() => {
      mountForTest(<ImportedSolutions solutions={[solution]} />, document.createElement('div'));
    });

    const heading = find('#oSolutions');
    expect(find('#divDynLb').nextElementSibling).toBe(heading);
    expect(heading.textContent.trim()).toBe('How to unlock the Combat Veteran achievement');
    expect(required(heading.nextElementSibling).matches('ul.posts')).toBe(true);
    expect(required(required(heading.nextElementSibling).nextElementSibling).matches('.add-comment')).toBe(true);
  });

  test('adds them after the video player on an older page without #divDynLb', async () => {
    setHtml('@ta-x-test-views/achievement-page/old-video-player.html');
    expect(document.querySelector('ul.posts')).toBeNull();

    await act(() => {
      mountForTest(<ImportedSolutions solutions={[solution]} />, document.createElement('div'));
    });

    const heading = find('#oSolutions');
    const player = find('main .nn_player_w');
    expect(player.nextElementSibling).toBe(heading);
    expect(heading.tagName).toBe(siteHeading().tagName);
    expect(heading.className).toBe(siteHeading().className);
    expect(heading.textContent.trim()).toBe(siteHeading().textContent.trim());
    expect(required(heading.nextElementSibling).matches('ul.posts')).toBe(true);
    expect(required(heading.nextElementSibling).querySelectorAll(':scope > li')).toHaveLength(1);
  });

  test('uses the list the achievement already has, adding no heading', async () => {
    setHtml('@ta-x-test-views/achievement-page/with-solutions.html');
    const list = find('ul.posts');
    const siteSolutions = list.children.length;

    await act(() => {
      mountForTest(<ImportedSolutions solutions={[solution]} />, document.createElement('div'));
    });

    expect(document.querySelectorAll('#oSolutions')).toHaveLength(1);
    expect(list.children).toHaveLength(siteSolutions + 1);
  });

  test('removes the heading and list it added once the last guide goes', async () => {
    setHtml('@ta-x-test-views/achievement-page/no-solutions.html');
    const container = document.createElement('div');
    const root = mountForTest(<ImportedSolutions solutions={[solution]} />, container);
    await act(() => {});
    expect(document.querySelector('#oSolutions')).not.toBeNull();

    await act(() => root.render(<ImportedSolutions solutions={[]} />));

    expect(document.querySelector('#oSolutions')).toBeNull();
    expect(document.querySelector('ul.posts')).toBeNull();

    await act(() => root.render(<ImportedSolutions solutions={[solution]} />));

    expect(document.querySelectorAll('#oSolutions')).toHaveLength(1);
    expect(find('ul.posts').querySelectorAll(':scope > li')).toHaveLength(1);
  });

  test('removes the heading and list it added when it unmounts', async () => {
    setHtml('@ta-x-test-views/achievement-page/no-solutions.html');
    const root = mountForTest(<ImportedSolutions solutions={[solution]} />, document.createElement('div'));
    await act(() => {});

    await act(() => root.unmount());

    expect(document.querySelector('#oSolutions')).toBeNull();
    expect(document.querySelector('ul.posts')).toBeNull();
  });

  test("takes its guides out of the site's list and leaves the site's solutions and heading", async () => {
    setHtml('@ta-x-test-views/achievement-page/with-solutions.html');
    const list = find('ul.posts');
    const siteSolutions = list.children.length;
    const root = mountForTest(<ImportedSolutions solutions={[solution]} />, document.createElement('div'));
    await act(() => {});

    await act(() => root.render(<ImportedSolutions solutions={[]} />));

    expect(document.querySelectorAll('#oSolutions')).toHaveLength(1);
    expect(list.isConnected).toBe(true);
    expect(list.children).toHaveLength(siteSolutions);
  });
});
