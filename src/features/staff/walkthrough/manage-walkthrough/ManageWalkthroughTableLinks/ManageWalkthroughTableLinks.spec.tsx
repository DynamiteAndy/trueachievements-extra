import * as taxFetch from '@ta-x-fetch';
import { logger } from '@ta-x-lib';
import { isAppliedLive, settings } from '@ta-x-storage';
import {
  changeSettingLive,
  fetchDocumentsThroughMemoizeFetch,
  fetchPagesByUrl,
  find,
  mountForTest,
  readFixture,
  readFixtureDocument,
  required,
  setHtml,
  setSettings,
  useFakeTimers
} from '@ta-x-test';

import { ManageWalkthrough } from '../ManageWalkthrough';
import styles from '../styles';

// Through the page's controller, which renders the table links with the panels it holds
describe('ManageWalkthroughTableLinks', () => {
  const cells = (list: string): HTMLElement[] => [...document.querySelectorAll<HTMLElement>(`#${list} .c1`)];
  const links = (list: string): string[] =>
    cells(list).map((cell) => {
      const link = cell.querySelector('a');
      return link ? `${link.textContent.trim()} -> ${link.pathname}${link.hash}` : cell.textContent.trim();
    });
  const holder = (): HTMLElement => find('#divWalkthroughHolder');
  const total = (): string => find('#lstWalkthroughAchievementID .total').textContent;

  const mountController = () =>
    mountForTest(<ManageWalkthrough holder={holder()} />, holder(), find('#chEditWalkthrough').nextSibling);

  const fetchPages = () =>
    fetchPagesByUrl({
      'walkthroughpreview.aspx?walkthroughid=3567': readFixture(
        '@ta-x-test-views/staff-walkthrough-preview/for-walkthrough-selected.html'
      ),
      '/game/Asdivine-Dios/achievements': readFixture('@ta-x-test-views/game-achievements/asdivine-dios.html')
    });

  beforeEach(() => {
    fetchDocumentsThroughMemoizeFetch();
    setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html');
    // The fixture's links are stripped to #: the site's are postbacks carrying the walkthrough id
    find('#lstWalkthroughIDselectedrow a').setAttribute('href', "javascript:Postback('lstWalkthroughIDE','3567')");
  });

  // The controller has moved its panels, so its effects have run
  const panelsMoved = () =>
    vi.waitFor(() =>
      expect(required(find('#chWalkthroughGames').parentElement)).toHaveExactClasses([
        styles.manageWalkthroughContainer
      ])
    );

  test('should apply live: on, off and on again from the menu, off giving the tables back exactly', async () => {
    const setting = settings.staff.walkthrough.manageWalkthrough.clickableTableLinks;
    setSettings({ 'staff.walkthrough.manageWalkthrough.clickableTableLinks': false });
    const memoizeFetch = fetchPages();

    const root = mountController();
    await panelsMoved();
    const off = holder().innerHTML;

    expect(memoizeFetch).not.toHaveBeenCalled();
    expect(links('scrolllstWalkthroughGames')).toEqual(['Asdivine Dios']);
    expect(isAppliedLive(setting)).toBe(true);

    await changeSettingLive(setting, true);
    await vi.waitFor(() => expect(total()).toBe('Total records: 20/4'));
    expect(links('scrolllstWalkthroughGames')).toEqual(['Asdivine Dios -> /game/Asdivine-Dios']);
    const on = holder().innerHTML;

    await changeSettingLive(setting, false);
    expect(holder().innerHTML).toBe(off);

    await changeSettingLive(setting, true);
    await vi.waitFor(() => expect(total()).toBe('Total records: 20/4'));
    expect(holder().innerHTML).toBe(on);

    root.unmount();
    expect(isAppliedLive(setting)).toBe(false);
  });

  describe('when enabled', () => {
    beforeEach(() => {
      setSettings({ 'staff.walkthrough.manageWalkthrough.clickableTableLinks': true });
      fetchPages();
    });

    test('should link the achievements to their achievement pages', async () => {
      mountController();

      await vi.waitFor(() =>
        expect(links('scrolllstWalkthroughAchievementID').slice(0, 3)).toEqual([
          'First Step -> /a274842/first-step-achievement#96119',
          'All for One, One for All -> /a274843/all-for-one-one-for-all-achievement#96119',
          'Bronze Honors -> /a274844/bronze-honors-achievement#96119'
        ])
      );
      // The achievements page's own link, with its attributes
      expect(find('a', cells('scrolllstWalkthroughAchievementID')[0])).toHaveExactClasses(['title']);
    });

    // A long list comes in across the parser's pauses: the preview and the games' achievements can be back before the
    // list's total, and so before the merge
    test('should count and portal into the merged list when its total turns up after the preview', async () => {
      const [first] = [...document.querySelectorAll<HTMLTableRowElement>('#scrolllstWalkthroughAchievementID tr')];
      const copy = first.cloneNode(true) as HTMLTableRowElement;
      find('.c2', copy).textContent = '7';
      required(first.parentElement).append(copy);
      const totalCell = find('#lstWalkthroughAchievementID .total');
      // As live, the total counts every row the site sent, the copy included (the fixture's list is cut short)
      totalCell.textContent = 'Total records: 4';
      const totalParent = required(totalCell.parentElement);
      totalCell.remove();

      useFakeTimers();
      const root = mountController();
      await vi.waitFor(() =>
        expect(links('scrolllstWalkthroughGames')).toEqual(['Asdivine Dios -> /game/Asdivine-Dios'])
      );
      // Time enough for links started on the preview to finish: they mustn't start before the list's total
      await vi.advanceTimersByTimeAsync(1000);

      totalParent.append(totalCell);

      await vi.waitFor(() => expect(totalCell.textContent).toBe('Total records: 3/4'));
      root.unmount();
      expect(totalCell.textContent).toBe('Total records: 4');
    });

    test('should add the achievements the walkthrough is missing, with no page', async () => {
      mountController();

      await vi.waitFor(() => expect(total()).toBe('Total records: 20/4'));
      const rows = [...document.querySelectorAll('#scrolllstWalkthroughAchievementID tr')];
      const added = rows[rows.length - 1];
      // The row's cells are ManageWalkthroughAchievementRow's own spec
      expect(rows).toHaveLength(4);
      const link = find<HTMLAnchorElement>('.c1 a.title', added);
      expect(`${link.pathname}${link.hash}`).toBe('/a274848/damage-dealer-achievement#96119');
      expect(find('.c1', added).textContent.trim()).toBe('Damage Dealer');
    });

    test("should warn under our name and leave the tables as they were when the preview can't be fetched", async () => {
      vi.mocked(taxFetch.memoizeFetch).mockRejectedValue(new Response(null, { status: 500 }));
      const warn = vi.spyOn(logger, 'warn');

      mountController();

      await vi.waitFor(() =>
        expect(warn).toHaveBeenCalledWith(
          'manage-walkthrough',
          "the walkthrough's preview couldn't be read",
          expect.any(Response)
        )
      );
      expect(links('scrolllstWalkthroughGames')).toEqual(['Asdivine Dios']);
      expect(total()).toBe('Total records: 20');
    });

    test('should still link the games and the gamers when the achievements panel has no table', async () => {
      find('#scrolllstWalkthroughAchievementID table').remove();
      const logError = vi.spyOn(logger, 'error');

      mountController();

      await vi.waitFor(() =>
        expect(links('scrolllstWalkthroughGames')).toEqual(['Asdivine Dios -> /game/Asdivine-Dios'])
      );
      expect(links('scrolllstWalkthroughGamers')).toContain('Avianette -> /gamer/Avianette');
      // The achievements give up quietly, rather than failing on the missing table
      expect(logError).not.toHaveBeenCalled();
      expect(total()).toBe('Total records: 20');
    });

    test('should link the games and the gamers listed on the preview', async () => {
      mountController();

      await vi.waitFor(() =>
        expect(links('scrolllstWalkthroughGames')).toEqual(['Asdivine Dios -> /game/Asdivine-Dios'])
      );
      expect(links('scrolllstWalkthroughGamers')).toEqual([
        'ManicMetalhead',
        'Avianette -> /gamer/Avianette',
        'Dynamite Andy -> /gamer/Dynamite+Andy'
      ]);
    });

    test('should give games sharing a name a link each', async () => {
      // Rows with nothing else to tell them apart (no id or link, and not in the preview's order): the fixture's game
      // row copied, and the preview's game link copied to point at a second game of the same name
      const [row] = cells('scrolllstWalkthroughGames');
      const gameRow = required(row.closest('tr'));
      required(gameRow.parentElement).append(gameRow.cloneNode(true));

      const preview = readFixtureDocument('@ta-x-test-views/staff-walkthrough-preview/for-walkthrough-selected.html');
      const gameLink = find<HTMLAnchorElement>('.walkthroughsummary .games a.gamelink', preview);
      const otherGame = gameLink.cloneNode(true) as HTMLAnchorElement;
      otherGame.setAttribute('href', '/game/Asdivine-Dios-2');
      gameLink.after(otherGame);
      fetchPagesByUrl({
        'walkthroughpreview.aspx?walkthroughid=3567': preview.documentElement.outerHTML,
        '/game/Asdivine-Dios/achievements': readFixture('@ta-x-test-views/game-achievements/asdivine-dios.html'),
        '/game/Asdivine-Dios-2/achievements': readFixture('@ta-x-test-views/game-achievements/asdivine-dios.html')
      });

      mountController();

      await vi.waitFor(() =>
        expect(links('scrolllstWalkthroughGames')).toEqual([
          'Asdivine Dios -> /game/Asdivine-Dios',
          'Asdivine Dios -> /game/Asdivine-Dios-2'
        ])
      );
    });

    test('should give the tables back as they were once unmounted', async () => {
      const before = holder().innerHTML;

      const root = mountController();
      await vi.waitFor(() => expect(total()).toBe('Total records: 20/4'));
      expect(links('scrolllstWalkthroughGames')).toEqual(['Asdivine Dios -> /game/Asdivine-Dios']);
      root.unmount();

      expect(holder().innerHTML).toBe(before);
    });
  });
});
