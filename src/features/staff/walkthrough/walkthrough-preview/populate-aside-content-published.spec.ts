import { memoizedFetches } from '@ta-x-fetch';
import { fetchPagesByUrl, find, readFixture, required, setHtml } from '@ta-x-test';

import {
  achievementsSection,
  asideHidden,
  loadPagePreview,
  pagesSection,
  populate,
  thanksSection,
  walkthroughsOf
} from './populate-aside-content.spec-helpers';
import { rememberPages } from './preview-page-walkthroughs';

// A published walkthrough: its preview has its pages, and its public page (found through the manage page's View public
// page button) its thanks and achievements
describe('staff/walkthrough/walkthrough-preview/populate-aside-content a published walkthrough', () => {
  const publicUrl = 'https://www.trueachievements.com/game/Xbox-One/walkthrough';

  beforeEach(loadPagePreview);

  // Page 2 ("Microsoft Store") of walkthrough 1578, published, whose id was remembered from an earlier preview. The
  // "View public page" post lands on `landsOn`, answered with `status`. Returns the post
  const previewLandingOn = async (landsOn: string, status = 200) => {
    setHtml('@ta-x-test-views/staff-walkthrough-page-preview/in-progress.html', {
      url: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx?pageid=7876'
    });
    await rememberPages('1578', ['7881', '7876']);
    fetchPagesByUrl({
      'managewalkthrough.aspx?walkthroughid=1578': readFixture(
        '@ta-x-test-views/staff-manage-walkthrough/published.html'
      ),
      'walkthroughpreview.aspx?walkthroughid=1578': readFixture(
        '@ta-x-test-views/staff-walkthrough-preview/published.html'
      )
    });
    // The site answers the post by redirecting to the public page
    const post = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      url: landsOn,
      text: async () => readFixture('@ta-x-test-views/game-walkthrough/xbox-apps.html')
    } as Response);

    await populate();

    return post;
  };

  // Each post: its address, method and body
  const posted = (post: Awaited<ReturnType<typeof previewLandingOn>>) =>
    post.mock.calls.map(([url, init = {}]) => [url, init.method, [...(init.body as URLSearchParams).entries()]]);
  // The manage page's View public page button's post: the form posted back unchanged
  const viewPublicPage = [
    'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=1578',
    'POST',
    [
      ['__VIEWSTATE', 'VIEWSTATE'],
      ['__VIEWSTATEGENERATOR', 'E9B59F14'],
      ['txtSearch', ''],
      ['ddlStatusFilter', '-1'],
      ['txtWalkthroughName', "Xbox Apps That Don't Need A WT"],
      ['txtStatus', 'Published'],
      ['chkSinglePageWalkthrough', 'True'],
      ['Command', 'btnViewWalkthrough'],
      ['Argument', '']
    ]
  ];

  // The page preview once its sections are there, the post landing on the public page
  const openPublishedPagePreview = async () => {
    const post = await previewLandingOn(publicUrl);
    await vi.waitFor(() => expect(achievementsSection()).not.toBeNull());

    return post;
  };

  test('should show its pages from its preview, and its thanks and achievements from its public page', async () => {
    await openPublishedPagePreview();

    expect([...find('aside').children]).toEqual([pagesSection(), thanksSection(), achievementsSection()]);
    expect(find('tbody tr a', pagesSection()).textContent.trim()).toBe("Xbox Apps That Don't Need A WT Walkthrough");
    expect(
      [...required(pagesSection()).querySelectorAll('tbody tr')].slice(1).map((row) => {
        const page = find('td[data-wp]', row);
        return [
          find('td.pos', row).textContent,
          page.getAttribute('data-wp'),
          page.textContent.trim(),
          page.querySelector('a') !== null
        ];
      })
    ).toEqual([
      ['1', '7881', 'Overview', true],
      ['2', '7876', 'Microsoft Store', false],
      ['3', '7877', 'Xbox 360 Inner Circle', true],
      ['4', '7878', 'Xbox 360 Team', true],
      ['5', '7879', 'Xbox LIVE Beta', true],
      ['6', '7880', 'Xbox One', true]
    ]);
  });

  test('should show the thanks count from its public page, linking to its thread, without the thank button', async () => {
    await openPublishedPagePreview();

    expect(find('.thanks span', thanksSection()).textContent).toBe('21');
    expect(find('.thread a', thanksSection()).getAttribute('href')).toBe(
      'https://www.trueachievements.com/forum/viewthread.aspx?tid=615775'
    );
    expect(required(thanksSection()).textContent).not.toContain('Thank the author');
  });

  test('should list the achievements as its public page does, linking to them there', async () => {
    await openPublishedPagePreview();

    expect(
      [...required(achievementsSection()).querySelectorAll('ul li')].map((item) => [
        item.getAttribute('data-i'),
        find('a', item).textContent,
        find('a', item).getAttribute('href'),
        find('img', item).getAttribute('src'),
        find('p', item).textContent
      ])
    ).toEqual([
      [
        '177244',
        'Xbox One Preorder',
        'https://www.trueachievements.com/game/Xbox-One/walkthrough#ap177244',
        'https://www.trueachievements.com/imagestore/thumbs/0007123200/7123217.jpg',
        'Xbox One Preorder'
      ],
      [
        '148344',
        'Zero Hour VIP',
        'https://www.trueachievements.com/game/Xbox-One/walkthrough#ap148344',
        'https://www.trueachievements.com/imagestore/thumbs/0007126500/7126516.jpg',
        ''
      ],
      [
        '148345',
        'NXE Launch Team',
        'https://www.trueachievements.com/game/Xbox-One/walkthrough#ap148345',
        'https://www.trueachievements.com/imagestore/thumbs/0007017600/7017626.jpg',
        'On November 19, 2008 we unleashed to the world a New Xbox Experience. Jump In.'
      ]
    ]);
  });

  test("should find its public page as the manage page's View public page button does, posting the form back unchanged", async () => {
    const post = await openPublishedPagePreview();

    expect(posted(post)).toEqual([viewPublicPage]);
  });

  test('should keep its public page, so its next preview reads it without posting again', async () => {
    const post = await openPublishedPagePreview();

    await openPublishedPagePreview();

    expect(posted(post)).toEqual([viewPublicPage]);
    expect(find('.thanks span', thanksSection()).textContent).toBe('21');
  });

  // The post goes to the manage page's address, whose GET the preview caches too, so its answer is kept apart
  test("should keep its public page under its own key, not the manage page's", async () => {
    await openPublishedPagePreview();

    expect(await memoizedFetches.get(`${viewPublicPage[0] as string}#view-public-page`)).toBe(
      readFixture('@ta-x-test-views/game-walkthrough/xbox-apps.html')
    );
    expect(await memoizedFetches.get(viewPublicPage[0] as string)).toBeNull();
  });

  test("should post again next time when the button didn't land on its public page", async () => {
    const post = await previewLandingOn(
      'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=1578'
    );
    await asideHidden();

    await openPublishedPagePreview();

    expect(posted(post)).toEqual([viewPublicPage, viewPublicPage]);
  });

  // e.g. the site erroring part way through the post, with its public page's address
  test('should go without its aside, and post again next time, when the post fails', async () => {
    const post = await previewLandingOn(publicUrl, 500);
    await asideHidden();

    await openPublishedPagePreview();

    expect(posted(post)).toEqual([viewPublicPage, viewPublicPage]);
  });

  test('should remember its pages, so its other page previews find it', async () => {
    await openPublishedPagePreview();

    expect(await walkthroughsOf(['7881', '7876', '7877', '7878', '7879', '7880'])).toEqual(Array(6).fill('1578'));
  });
});
