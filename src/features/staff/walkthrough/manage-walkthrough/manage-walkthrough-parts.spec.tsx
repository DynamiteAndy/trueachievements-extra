import * as taxFetch from '@ta-x-fetch';
import { memoizedFetches } from '@ta-x-fetch';
import { fromNow } from '@ta-x-lib';
import { StaffRegex } from '@ta-x-site';
import { arriveFrom, find, ids, mountForTest, neverFinds, required, setHtml, setSettings } from '@ta-x-test';

import { ManageWalkthrough } from './ManageWalkthrough';
import styles from './styles';

import manageWalkthrough from '.';

// The page tweaks the manage walkthrough page makes to the site's own markup, run through the feature as the page
// runs them (the table links and missing buttons left out: they have specs of their own)
describe('staff/walkthrough/manage-walkthrough parts', () => {
  const holder = (): HTMLElement => find('#divWalkthroughHolder');
  const container = (): HTMLElement => find(`.${styles.manageWalkthroughContainer}`);
  const achievementRows = (): HTMLTableRowElement[] => [
    ...document.querySelectorAll<HTMLTableRowElement>('#scrolllstWalkthroughAchievementID tr')
  ];

  // Runs the feature, unmounting its controller when the test ends
  const run = async (): Promise<void> => {
    vi.spyOn(StaffRegex.Walkthroughs.Test, 'manageWalkthroughUrl').mockReturnValue(true);
    onTestFinished(required(await manageWalkthrough()));
    // Its controller has mounted (a lookup that throws if not)
    container();
  };

  // The first achievement listed on a second page too (the fixture's walkthrough has none, so its row is copied onto
  // page 7), with the list's total counting both, as it does live (the fixture's list is cut to a few rows, its total
  // isn't). `rename` gives the copy's name from the first's. Returns the first row's page and the row count
  const addDuplicateAchievement = (rename = (name: string): string => name): { firstPage: string; rows: number } => {
    const [first] = achievementRows();
    const copy = first.cloneNode(true) as HTMLTableRowElement;
    find('.c1', copy).textContent = rename(find('.c1', first).textContent);
    find('.c2', copy).textContent = '7';
    required(first.parentElement).append(copy);
    const rows = achievementRows().length;
    find('#lstWalkthroughAchievementID .total').textContent = `Total records: ${rows}`;

    return { firstPage: find('.c2', first).textContent.trim(), rows };
  };

  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html');
    // The fixture's links are stripped to #: the site's are postbacks carrying the walkthrough id (checked live)
    document
      .querySelectorAll('#scrolllstWalkthroughID td a')
      .forEach((anchor, index) =>
        anchor.setAttribute('href', `javascript:Postback('lstWalkthroughIDE','${3567 + index}')`)
      );
  });

  test("should have the table links fetch the selected walkthrough's preview, by the id in its postback link", async () => {
    setSettings({ 'staff.walkthrough.manageWalkthrough.clickableTableLinks': true });
    const fetched = vi
      .spyOn(taxFetch, 'memoizeFetchDocument')
      .mockResolvedValue(document.implementation.createHTMLDocument());

    await run();

    await vi.waitFor(() =>
      expect(fetched.mock.calls).toEqual([
        [
          'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=3567',
          {},
          { deleteAfter: { value: 4, period: 'hours' } }
        ]
      ])
    );
  });

  // A post back can change the walkthrough's games and editors, which the links read from its preview: the copy is
  // dropped before the read, not left to the preview's own drop, which waits for the page to be parsed
  test.each([
    { arrival: 'a visit from another page', postBack: false },
    // A post back arrives with the page's own address as its referrer
    { arrival: 'a post back', postBack: true }
  ])("should drop the preview's cached copy before reading it only after $arrival", async ({ postBack }) => {
    const preview = 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=3567';
    await memoizedFetches.set(preview, '<html>cached</html>', fromNow({ value: 1, period: 'hours' }));
    arriveFrom(postBack ? window.location.href : 'https://www.trueachievements.com/staff');
    setSettings({ 'staff.walkthrough.manageWalkthrough.clickableTableLinks': true });
    const cachedAtRead: (string | null)[] = [];
    vi.spyOn(taxFetch, 'memoizeFetchDocument').mockImplementation(async (url) => {
      cachedAtRead.push(await memoizedFetches.get(url));
      return document.implementation.createHTMLDocument();
    });

    await run();

    await vi.waitFor(() => expect(cachedAtRead).toEqual([postBack ? null : '<html>cached</html>']));
  });

  test("should move the hidden Action menu's items into the buttons row, as buttons", async () => {
    await run();

    const buttons = find('.buttons', find('#btnWalkthrough_Options').closest('.content'));
    await vi.waitFor(() =>
      expect([...buttons.querySelectorAll(':scope > a')].map((a) => a.textContent.trim())).toEqual([
        // The site's own
        'Action',
        'Cancel',
        'Save',
        'Add page',
        'View public page',
        'Preview',
        'View and edit content',
        'Clear Cache'
      ])
    );
    expect(document.querySelectorAll('#btnWalkthrough_Options li a')).toHaveLength(0);
    expect([...buttons.querySelectorAll(':scope > a.button')]).toHaveLength(8);
    // Spaced as a row of its own (the moved items have no whitespace between them)
    expect(buttons).toHaveExactClasses(['buttons', styles.manageWalkthroughActionButtonsRow]);
  });

  test('should merge an achievement listed on two pages into one row, and correct the total', async () => {
    const { firstPage, rows } = addDuplicateAchievement();

    await run();

    await vi.waitFor(() => expect(achievementRows()).toHaveLength(rows - 1));
    expect(find('.c2', achievementRows()[0]).textContent.trim()).toBe(`${firstPage}, 7`);
    expect(find('#lstWalkthroughAchievementID .total').textContent).toBe(`Total records: ${rows - 1}`);
  });

  // A long list comes in across the parser's pauses: the controller mounts on the panel's start, before its last rows
  // and the total after them
  test('should merge only once the list has been parsed to its total, so a later row is merged too', async () => {
    const { firstPage, rows } = addDuplicateAchievement();
    const copy = required(achievementRows().at(-1));
    const body = required(copy.parentElement);
    const total = find('#lstWalkthroughAchievementID .total');
    const totalParent = required(total.parentElement);
    copy.remove();
    total.remove();

    mountForTest(<ManageWalkthrough holder={holder()} />, holder(), find('#chEditWalkthrough').nextSibling);
    await vi.waitFor(() => expect(ids(container())).toHaveLength(4));
    expect(find('.c2', achievementRows()[0]).textContent.trim()).toBe(firstPage);

    body.append(copy);
    totalParent.append(total);

    await vi.waitFor(() => expect(achievementRows()).toHaveLength(rows - 1));
    expect(find('.c2', achievementRows()[0]).textContent.trim()).toBe(`${firstPage}, 7`);
    expect(total.textContent).toBe(`Total records: ${rows - 1}`);
  });

  test.each([
    { name: 'in another case', rename: (name: string) => name.toUpperCase() },
    { name: 'with spaces around it', rename: (name: string) => `  ${name.trim()} ` }
  ])('should merge an achievement listed again $name, as the table links match names', async ({ rename }) => {
    const { firstPage, rows } = addDuplicateAchievement(rename);

    await run();

    await vi.waitFor(() => expect(achievementRows()).toHaveLength(rows - 1));
    expect(find('.c2', achievementRows()[0]).textContent.trim()).toBe(`${firstPage}, 7`);
  });

  test.each([
    { which: 'its first row', row: 0 },
    { which: 'the copy', row: -1 }
  ])('should leave an achievement listed twice as it is when $which has no pages cell', async ({ row }) => {
    const { rows } = addDuplicateAchievement();
    const withoutPages = required(achievementRows().at(row));
    // The pages are read from the cell after the name, so the name is left the row's last cell
    let next = find('.c1', withoutPages).nextElementSibling;
    while (next) {
      const after = next.nextElementSibling;
      next.remove();
      next = after;
    }
    const total = find('#lstWalkthroughAchievementID .total').textContent;

    await run();

    // The panels moved, so the controller has run its effects
    await vi.waitFor(() => expect(ids(container())).toHaveLength(4));
    expect(achievementRows()).toHaveLength(rows);
    expect(find('#lstWalkthroughAchievementID .total').textContent).toBe(total);
  });

  test('should still move the other sidebar panels when one is missing', async () => {
    find('#chWalkthroughGamers').remove();
    neverFinds('#chWalkthroughGamers');

    await run();

    await vi.waitFor(() =>
      expect(ids(container())).toEqual([
        'chWalkthroughAchievements',
        'chWalkthroughGames',
        'chWalkthroughOtherSiteLink'
      ])
    );
    expect(ids(holder())).toEqual(['chWalkthroughs', 'chEditWalkthrough', styles.manageWalkthroughContainer]);
  });

  test('should give the page back as it was once unmounted', async () => {
    // A duplicate achievement too, so the merge is undone as well
    addDuplicateAchievement();
    const before = holder().innerHTML;
    const editWalkthrough = find('#chEditWalkthrough');

    const root = mountForTest(<ManageWalkthrough holder={holder()} />, holder(), editWalkthrough.nextSibling);
    await vi.waitFor(() => expect(ids(container())).toHaveLength(4));
    await vi.waitFor(() => expect(document.querySelectorAll('#btnWalkthrough_Options li a')).toHaveLength(0));
    root.unmount();

    // Exactly: no empty class attribute left on a site element that had none
    expect(holder().innerHTML).toBe(before);
  });

  test("should leave an Action menu item's own button class on once unmounted", async () => {
    // An item the site has already made a button (none is in the fixture)
    const item = find('#btnWalkthrough_Options li a');
    item.classList.add('button');

    const root = mountForTest(
      <ManageWalkthrough holder={holder()} />,
      holder(),
      find('#chEditWalkthrough').nextSibling
    );
    await vi.waitFor(() => expect(document.querySelectorAll('#btnWalkthrough_Options li a')).toHaveLength(0));
    root.unmount();

    expect(item.closest('#btnWalkthrough_Options')).not.toBeNull();
    expect(item).toHaveExactClasses(['button']);
  });
});
