import { find, readFixture } from '@ta-x-test';

import {
  achievementsSection,
  askSaysNotFound,
  askSection,
  askShown,
  asideHidden,
  fetchPages,
  loadPagePreview,
  loadWalkthroughPreview,
  managePage,
  pageIds,
  populate,
  rememberBlud,
  typeWalkthroughId,
  walkthroughsOf
} from './populate-aside-content.spec-helpers';

// The walkthroughs it has nothing to show for, so it removes the aside: one not in progress, or one the gamer can't
// open. One typed into the ask panel asks again instead (populate-aside-content-asking.spec), so another can be tried
describe('staff/walkthrough/walkthrough-preview/populate-aside-content removing the aside', () => {
  beforeEach(loadPagePreview);

  // The site's other statuses, from the manage walkthrough page's status filter. The
  // fixture's manage page has no #frm (no access to edit it), so a published walkthrough can't be read either
  test.each(['Published', 'New', 'Merged', 'New owner required'])(
    'should remove the aside for a walkthrough whose status is %s, fetching nothing past its manage page',
    async (status) => {
      await rememberBlud();
      const memoizeFetch = fetchPages({
        [managePage]: readFixture('@ta-x-test-views/staff-manage-walkthrough/in-progress.html').replace(
          'value="In progress"',
          `value="${status}"`
        )
      });

      await populate();
      await asideHidden();

      expect(askSection()).toBeNull();
      expect(memoizeFetch.mock.calls.map(([url]) => url)).toEqual([
        `https://www.trueachievements.com/staff/walkthrough/${managePage}`
      ]);
    }
  );

  describe("a walkthrough the gamer can't open", () => {
    // The site answers its manage page with the walkthrough list instead of the walkthrough
    const fetchWithoutAccess = () =>
      fetchPages({ [managePage]: readFixture('@ta-x-test-views/staff-manage-walkthrough/no-access.html') });

    test('should remove the aside on a page whose remembered walkthrough it can no longer open', async () => {
      await rememberBlud();
      fetchWithoutAccess();

      await populate();

      await asideHidden();
      expect(askSection()).toBeNull();
      expect(achievementsSection()).toBeNull();
    });

    test("should keep the aside, asking again and saying it wasn't found, when the id typed in is one it can't open, remembering nothing", async () => {
      fetchWithoutAccess();
      await populate();
      await vi.waitFor(() => expect(askShown()).toBe(true));

      typeWalkthroughId('4138');

      await vi.waitFor(() => expect(askSaysNotFound()).toBe(true));
      expect(askShown()).toBe(true);
      expect([...find('aside').children]).toEqual([askSection()]);
      expect(await walkthroughsOf(pageIds)).toEqual(Array(pageIds.length).fill(null));
    });

    test("should remove the aside on the walkthrough's own preview", async () => {
      loadWalkthroughPreview();
      fetchWithoutAccess();

      await populate();

      await asideHidden();
      expect(askSection()).toBeNull();
    });
  });
});
