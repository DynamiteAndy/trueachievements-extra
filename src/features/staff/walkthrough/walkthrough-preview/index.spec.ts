import { memoizedFetches } from '@ta-x-fetch';
import { fromNow } from '@ta-x-lib';
import { arriveFrom, find, setHtml, setSettings } from '@ta-x-test';

import { hideAside } from './hide-aside';
import { populateAsideContent } from './populate-aside-content';

import walkthroughPreview from '.';

vi.mock('./populate-aside-content', () => ({ populateAsideContent: vi.fn() }));
vi.mock('./hide-aside', () => ({ hideAside: vi.fn() }));

// What hiding and filling the side column do is each one's own spec: this checks which runs
describe('staff/walkthrough/walkthrough-preview', () => {
  const pagePreview = 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx?pageid=26660';

  test('should leave a page that is not a walkthrough preview alone', async () => {
    setHtml('@ta-x-test-views/staff-walkthrough-page-preview/in-progress.html', {
      url: 'https://www.trueachievements.com/'
    });
    setSettings({ 'staff.walkthrough.walkthroughPreview.populateAsideContent': false });

    await walkthroughPreview();

    expect(hideAside).not.toHaveBeenCalled();
    expect(populateAsideContent).not.toHaveBeenCalled();
  });

  test('should hide the side column when "Fill In Side Column" is off', async () => {
    setHtml('@ta-x-test-views/staff-walkthrough-page-preview/in-progress.html', { url: pagePreview });
    setSettings({ 'staff.walkthrough.walkthroughPreview.populateAsideContent': false });

    await walkthroughPreview();

    expect(hideAside).toHaveBeenCalledExactlyOnceWith();
    expect(populateAsideContent).not.toHaveBeenCalled();
  });

  test('should fill the side column, not hiding it, when the setting is on, handing back its unmount', async () => {
    setHtml('@ta-x-test-views/staff-walkthrough-page-preview/in-progress.html', { url: pagePreview });
    setSettings({ 'staff.walkthrough.walkthroughPreview.populateAsideContent': true });
    const unmount = vi.fn();
    vi.mocked(populateAsideContent).mockResolvedValue(unmount);

    expect(await walkthroughPreview()).toBe(unmount);
    expect(populateAsideContent).toHaveBeenCalledExactlyOnceWith();
    expect(hideAside).not.toHaveBeenCalled();
  });

  // The preview keeps each walkthrough's manage page for a few hours; a post back that may have changed the
  // walkthrough, on the pages where it changes, drops that copy, so its next preview reads it afresh. A plain visit, or
  // a post back that only looks, keeps it
  describe("a post back on a walkthrough's manage page or walkthrough page", () => {
    // A post back arrives from the page's own address; with no control clicked first, nothing is recorded, as after a
    // reload
    const postBack = (page = 'managewalkthrough.aspx'): void =>
      arriveFrom(`https://www.trueachievements.com/staff/walkthrough/${page}`);
    // The control's Postback call as the site writes it (the captured fixtures have it stripped), clicked on the page
    // before the post back, without the site's own handler running
    const clickPostback = async (selector: string, code: string): Promise<void> => {
      const control = find(selector);
      control.setAttribute(control.tagName === 'A' ? 'onclick' : 'onchange', code);
      const stop = await walkthroughPreview();
      document.addEventListener('click', (event) => event.stopImmediatePropagation(), { capture: true, once: true });
      control.dispatchEvent(new Event('click', { bubbles: true }));
      stop?.();
    };
    const managePage = (id: string): string =>
      `https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=${id}`;
    const cached = (): Promise<(string | null)[]> =>
      Promise.all([managePage('3567'), managePage('4138')].map((key) => memoizedFetches.get(key)));

    beforeEach(async () => {
      await memoizedFetches.set(managePage('3567'), '<html>cached</html>', fromNow({ value: 1, period: 'hours' }));
      await memoizedFetches.set(managePage('4138'), '<html>cached</html>', fromNow({ value: 1, period: 'hours' }));
    });

    test.each([
      ['manage page', '@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html', 'managewalkthrough.aspx'],
      ['walkthrough page', '@ta-x-test-views/staff-walkthrough-page/page-selected.html', 'walkthroughpage.aspx']
    ])(
      "should drop that walkthrough's cached manage page after a reload of its %s, keeping the others, whatever the setting",
      async (_page, fixture, path) => {
        setHtml(fixture, {
          url: `https://www.trueachievements.com/staff/walkthrough/${path}?walkthroughid=3567&walkthroughpageid=22623`
        });
        setSettings({ 'staff.walkthrough.walkthroughPreview.populateAsideContent': false });
        postBack(path);

        expect(await walkthroughPreview()).toBeTypeOf('function');

        expect(await cached()).toEqual([null, '<html>cached</html>']);
        expect(hideAside).not.toHaveBeenCalled();
        expect(populateAsideContent).not.toHaveBeenCalled();
      }
    );

    // A save on the manage page saves the walkthrough it shows: after a pick from its list that's the list's selected
    // row (its postback link, which the captured fixture has without its target), whatever the address
    test.each([
      ['the list', ''],
      ["another walkthrough's", '?walkthroughid=4138']
    ])(
      "should drop the selected walkthrough's cached manage page after a save on %s address",
      async (_address, search) => {
        const url = `https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx${search}`;
        const page = (): void => {
          setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html', { url });
          find('#lstWalkthroughIDselectedrow a').setAttribute(
            'href',
            "javascript:Postback('lstWalkthroughIDE','3567')"
          );
        };
        page();
        await clickPostback('#btnSave', "Postback('btnSave_click');return false;");
        page();
        postBack();

        await walkthroughPreview();

        expect(await cached()).toEqual([null, search ? null : '<html>cached</html>']);
      }
    );

    // Picking a walkthrough, sorting a list or filtering it shows the walkthrough; it changes nothing
    test.each([
      ['picking a walkthrough from the list', '#lstWalkthroughIDselectedrow a', "Postback('lstWalkthroughIDE','3567')"],
      [
        'sorting the walkthrough list',
        '#lstWalkthroughIDselectedrow a',
        "Postback('lstWalkthroughIDH','WalkthroughName')"
      ]
    ])("should keep that walkthrough's copies after %s", async (_action, selector, call) => {
      const url = 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=3567';
      setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html', { url });
      await clickPostback(selector, `${call};return false;`);
      setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html', { url });
      postBack();

      await walkthroughPreview();

      expect(await cached()).toEqual(['<html>cached</html>', '<html>cached</html>']);
    });

    // The table links and a published walkthrough's page list read its preview: a game, editor or page changed here
    // shows in them too
    test("should drop that walkthrough's cached preview too", async () => {
      const preview = 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=3567';
      await memoizedFetches.set(preview, '<html>cached</html>', fromNow({ value: 1, period: 'hours' }));
      setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html', {
        url: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=3567'
      });
      postBack();

      await walkthroughPreview();

      expect(await memoizedFetches.get(preview)).toBeNull();
    });

    // A published walkthrough's thanks and achievements come from its public page, cached under the manage page's
    // address with the "View public page" hash
    test("should drop that walkthrough's cached public page too", async () => {
      const publicPage =
        'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=3567#view-public-page';
      await memoizedFetches.set(publicPage, '<html>cached</html>', fromNow({ value: 1, period: 'hours' }));
      setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html', {
        url: 'https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx?walkthroughid=3567'
      });
      postBack();

      await walkthroughPreview();

      expect(await memoizedFetches.get(publicPage)).toBeNull();
    });

    test.each(['', '?walkthroughid=abc'])(
      'should drop nothing on a manage page whose address is "%s"',
      async (search) => {
        setHtml('@ta-x-test-views/staff-manage-walkthrough/no-walkthrough-selected.html', {
          url: `https://www.trueachievements.com/staff/walkthrough/managewalkthrough.aspx${search}`
        });
        postBack();

        await walkthroughPreview();

        expect(await cached()).toEqual(['<html>cached</html>', '<html>cached</html>']);
      }
    );

    // Arriving from another page changes nothing, so the copies are worth keeping
    test("should keep every copy on a plain visit to that walkthrough's manage page", async () => {
      const copies = [
        managePage('3567'),
        `${managePage('3567')}#view-public-page`,
        'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=3567'
      ];
      await Promise.all(
        copies.map((key) => memoizedFetches.set(key, '<html>cached</html>', fromNow({ value: 1, period: 'hours' })))
      );
      setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html', { url: managePage('3567') });
      arriveFrom('https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=3567');

      await walkthroughPreview();

      expect(await Promise.all(copies.map((key) => memoizedFetches.get(key)))).toEqual([
        '<html>cached</html>',
        '<html>cached</html>',
        '<html>cached</html>'
      ]);
    });
  });
});
