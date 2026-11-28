import {
  fetchDocumentsThroughMemoizeFetch,
  fetchPagesByUrl,
  find,
  readFixture,
  readFixtureDocument,
  required,
  setHtml
} from '@ta-x-test';

import { walkthroughMarkup } from '../shared';

import { linkAchievements } from './clickable-table-links';

// The rest of its matching is ManageWalkthroughTableLinks' spec, through the page's controller, which merges a name
// listed twice before this runs
describe('staff/walkthrough/manage-walkthrough/clickable-table-links', () => {
  test('should link only the first of two achievement rows sharing a name', async () => {
    fetchDocumentsThroughMemoizeFetch();
    fetchPagesByUrl({
      '/game/Asdivine-Dios/achievements': readFixture('@ta-x-test-views/game-achievements/asdivine-dios.html')
    });
    setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html');
    const panel = find(walkthroughMarkup.achievementsPanel);
    const [first] = panel.querySelectorAll<HTMLElement>(`${walkthroughMarkup.achievementsTable} .c1`);
    const row = required(first.closest('tr'));
    const copy = row.cloneNode(true) as HTMLTableRowElement;
    required(row.parentElement).append(copy);

    const result = required(
      await linkAchievements(
        panel,
        readFixtureDocument('@ta-x-test-views/staff-walkthrough-preview/for-walkthrough-selected.html')
      )
    );

    const firstStep = result.links.filter(({ cell }) => cell.innerText.trim() === 'First Step');
    expect(firstStep.map(({ cell }) => cell)).toEqual([first]);
    expect(result.links.some(({ cell }) => copy.contains(cell))).toBe(false);
  });

  test('should fetch no game achievements page for a panel with no table', async () => {
    fetchDocumentsThroughMemoizeFetch();
    const pages = fetchPagesByUrl({});
    setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html');
    const panel = find(walkthroughMarkup.achievementsPanel);
    required(panel.querySelector(`${walkthroughMarkup.achievementsTable} table`)).remove();

    const result = await linkAchievements(
      panel,
      readFixtureDocument('@ta-x-test-views/staff-walkthrough-preview/for-walkthrough-selected.html')
    );

    expect(result).toBeUndefined();
    expect(pages).not.toHaveBeenCalled();
  });
});
