import { find, neverFinds, readFixture, required } from '@ta-x-test';

import { populateAsideContent } from './populate-aside-content';
import {
  achievementsSection,
  fetchPages,
  loadPagePreview,
  loadWalkthroughPreview,
  managePage,
  openPagePreview,
  pagesSection,
  populate,
  thanksSection
} from './populate-aside-content.spec-helpers';

// The sections it adds for a walkthrough in progress, read from its manage page, preview and game
describe('staff/walkthrough/walkthrough-preview/populate-aside-content sections', () => {
  beforeEach(loadPagePreview);

  test('should add nothing, without throwing, when the aside never loads', async () => {
    find('aside').remove();
    neverFinds('.page aside');

    const remove = await populateAsideContent();

    expect(document.querySelector('aside')).toBeNull();
    expect(() => remove()).not.toThrow();
  });

  test('should link back to the walkthrough preview like the site links back to the walkthrough', async () => {
    await openPagePreview();

    // The row's own markup is WalkthroughSummaryRow.spec's
    const link = find('tbody tr a', pagesSection());
    expect([link.getAttribute('href'), link.textContent.trim()]).toEqual([
      '/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=4138',
      '#BLUD Walkthrough'
    ]);
  });

  test('should list every page, linking all but the current one', async () => {
    await openPagePreview();

    const rows = [...required(pagesSection()).querySelectorAll('tbody tr')].slice(1);
    expect(rows).toHaveLength(13);
    expect(
      rows.slice(0, 4).map((row) => {
        const page = find('td[data-wp]', row);
        const link = page.querySelector('a');
        return [
          find('td.pos', row).textContent,
          page.getAttribute('data-wp'),
          page.textContent.trim(),
          link?.getAttribute('href') ?? null
        ];
      })
    ).toEqual([
      ['1', '26658', 'Walkthrough overview', '/staff/walkthrough/walkthroughpagepreview.aspx?pageid=26658'],
      ['2', '26659', 'General hints and tips', '/staff/walkthrough/walkthroughpagepreview.aspx?pageid=26659'],
      ['3', '26660', 'Intro', null],
      ['4', '26664', 'School Daze', '/staff/walkthrough/walkthroughpagepreview.aspx?pageid=26664']
    ]);
  });

  test("should list the walkthrough's achievements in page order, linking to them on their page", async () => {
    await openPagePreview();

    const items = [...required(achievementsSection()).querySelectorAll('ul li')];
    expect(
      items.map((item) => [
        item.getAttribute('data-i'),
        find('a', item).textContent.trim(),
        find('a', item).getAttribute('href'),
        find('p', item).textContent
      ])
    ).toEqual([
      [
        '434685',
        'Gamer Grrrrrl',
        '/staff/walkthrough/walkthroughpagepreview.aspx?pageid=26660#ap434685',
        'Beat Fantasy Adventure II.'
      ],
      [
        '434651',
        'Token Collector',
        '/staff/walkthrough/walkthroughpagepreview.aspx?pageid=26664#ap434651',
        'Find the first token in the game'
      ],
      [
        '434666',
        'Duck Face',
        '/staff/walkthrough/walkthroughpagepreview.aspx?pageid=26665#ap434666',
        "Like you *wouldn't* take selfies with all of the animals."
      ]
    ]);
    expect(
      items.map((item) => {
        const image = find('img', item);
        return [image.className, image.getAttribute('alt')];
      })
    ).toEqual([
      ['smallicon', 'Gamer Grrrrrl'],
      ['smallicon', 'Token Collector'],
      ['smallicon', 'Duck Face']
    ]);
  });

  test("should take an achievement's first row when the manage page lists its name twice", async () => {
    const manage = new DOMParser().parseFromString(
      readFixture('@ta-x-test-views/staff-manage-walkthrough/in-progress.html'),
      'text/html'
    );
    const tokenCollector = required(
      [...manage.querySelectorAll('#scrolllstWalkthroughAchievementID tbody tr')].find(
        (row) => row.querySelector('.c1')?.textContent.trim() === 'Token Collector'
      )
    );
    const later = tokenCollector.cloneNode(true) as HTMLElement;
    find('.c1', later).textContent = ' token collector ';
    find('.c2', later).textContent = '1';
    required(tokenCollector.parentElement).append(later);

    await openPagePreview({ [managePage]: manage.documentElement.outerHTML });

    const link = [...required(achievementsSection()).querySelectorAll('ul li a')].find(
      (anchor) => anchor.textContent.trim() === 'Token Collector'
    );
    expect(link?.getAttribute('href')).toBe('/staff/walkthrough/walkthroughpagepreview.aspx?pageid=26664#ap434651');
  });

  test("should draw each achievement's icon from the achievements page's sprite, scaled to the site's 32px", async () => {
    await openPagePreview();

    const sprite = 'url("https://www.trueachievements.com/smaps/29337_G12914_1_1.jpg")';
    expect(
      [...required(achievementsSection()).querySelectorAll<HTMLImageElement>('ul li img')].map((image) => [
        required(image.getAttribute('src')).startsWith('data:image/gif'),
        image.style.backgroundImage,
        image.style.backgroundSize,
        image.style.backgroundPosition
      ])
    ).toEqual([
      [true, sprite, '32px auto', '0px -1216px'],
      [true, sprite, '32px auto', '0px -128px'],
      [true, sprite, '32px auto', '0px -608px']
    ]);
  });

  test("should keep the placeholder image when the achievements page's icons can't be found", async () => {
    await openPagePreview({
      '/game/BLUD/achievements': readFixture('@ta-x-test-views/game-achievements/blud.html').replace(
        /<style>\s*\.sms[\s\S]*?<\/style>/,
        ''
      )
    });

    const placeholder = 'https://www.trueachievements.com/imagestore/m/0004101700/4101796.jpg';
    expect(
      [...required(achievementsSection()).querySelectorAll<HTMLImageElement>('ul li img')].map((image) => [
        image.getAttribute('src'),
        image.hasAttribute('style')
      ])
    ).toEqual([
      [placeholder, false],
      [placeholder, false],
      [placeholder, false]
    ]);
  });

  test('should link the thanks section to the walkthrough thread', async () => {
    await openPagePreview();

    expect(find('.thread a', thanksSection()).getAttribute('href')).toBe(
      'https://www.trueachievements.com/forum/viewthread.aspx?tid=1572263'
    );
    // Not the site's server-side `nv` class: it hides the count until the site's script removes it, which has already
    // run by the time we add the section
    expect(find('.thanks span', thanksSection()).className).toBe('');
    expect(find('.thanks span', thanksSection()).textContent).toBe('0');
  });

  test("should add just the thanks and achievements to the walkthrough's own preview", async () => {
    loadWalkthroughPreview();
    const memoizeFetch = fetchPages();

    await populate();
    await vi.waitFor(() => expect(achievementsSection()).not.toBeNull());

    expect([...find('aside').children]).toEqual([thanksSection(), achievementsSection()]);
    expect(required(achievementsSection()).querySelectorAll('ul li')).toHaveLength(3);
    // The game and thread come from this page, so it isn't fetched again
    expect(find('.thread a', thanksSection()).getAttribute('href')).toBe(
      'https://www.trueachievements.com/forum/viewthread.aspx?tid=1572263'
    );
    expect(memoizeFetch.mock.calls.map(([url]) => url).filter((url) => url.includes('walkthroughpreview'))).toEqual([]);
  });
});
