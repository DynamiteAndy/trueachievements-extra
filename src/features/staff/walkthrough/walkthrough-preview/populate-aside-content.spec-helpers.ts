import { fetchDocumentsThroughMemoizeFetch, fetchPagesByUrl, find, readFixture, setHtml, submitAsk } from '@ta-x-test';
import { hideClass, AskLoaderStyles } from '@ta-x-ui';

import { populateAsideContent } from './populate-aside-content';
import { previewPageWalkthroughs, rememberPages } from './preview-page-walkthroughs';
import styles from './styles';

// For the populate-aside-content specs: the walkthrough preview pages they open, the sections they read in the aside,
// and #BLUD's pages they're answered with. The feature's index runs it only while its setting is on (index.spec), so
// no setting is needed
// #BLUD's pages the earlier preview saw (two more are added after it)
export const pageIds = [
  '26658',
  '26659',
  '26660',
  '26664',
  '26665',
  '26666',
  '26667',
  '26668',
  '26669',
  '26670',
  '26671'
];
export const managePage = 'managewalkthrough.aspx?walkthroughid=4138';

// Page 3 ("Intro") of #BLUD, its walkthrough's pages read through memoizeFetch's spy: each spec's beforeEach
export const loadPagePreview = (): void => {
  fetchDocumentsThroughMemoizeFetch();
  setHtml('@ta-x-test-views/staff-walkthrough-page-preview/in-progress.html', {
    url: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpagepreview.aspx?pageid=26660'
  });
};

// #BLUD's walkthrough's own preview, in place of a page's
export const loadWalkthroughPreview = (): void => {
  setHtml('@ta-x-test-views/staff-walkthrough-preview/in-progress-whole-page.html', {
    url: 'https://www.trueachievements.com/staff/walkthrough/walkthroughpreview.aspx?walkthroughid=4138'
  });
};

// The preview without its side column: the aside removed and main widened by the site's no-aside class
export const asideHidden = () =>
  vi.waitFor(() => {
    expect(document.querySelector('.page aside')).toBeNull();
    expect(find('.page main')).toHaveExactClasses(['no-aside']);
  });

// Each section of the aside, null where a test checks it isn't there
const section = (className: string): HTMLElement | null => document.querySelector(`aside .${className}`);
export const pagesSection = () => section('page-index');
export const achievementsSection = () => section('walkthrough-right');
export const thanksSection = () => section('walkthroughthanks');
export const askSection = (): HTMLElement | null => section(styles.populateAsideContent);
// The ask section loaded, with its panel showing
export const askShown = (): boolean =>
  find(`:scope > article > .${AskLoaderStyles.askLoaderContainer}`, askSection()).getAttribute('data-ta-x-loaded') ===
    'true' && !find(`.${AskLoaderStyles.askLoaderAsk}`, askSection()).classList.contains(hideClass);
export const typeWalkthroughId = (id: string): void => void submitAsk(askSection(), id);
// The ask panel saying the id typed in wasn't found (the wording is WalkthroughInformation.spec's)
export const askSaysNotFound = (): boolean =>
  find(`.${AskLoaderStyles.askLoaderAsk} p`, askSection()).textContent.startsWith(
    "That walkthrough couldn't be found."
  );

// #BLUD's pages, each replaceable, by a part of its URL
export const fetchPages = (pages: Record<string, string> = {}) =>
  fetchPagesByUrl({
    [managePage]: readFixture('@ta-x-test-views/staff-manage-walkthrough/in-progress.html'),
    'walkthroughpreview.aspx?walkthroughid=4138': readFixture(
      '@ta-x-test-views/staff-walkthrough-preview/in-progress.html'
    ),
    '/game/BLUD/achievements': readFixture('@ta-x-test-views/game-achievements/blud.html'),
    ...pages
  });

// #BLUD's walkthrough id, remembered from an earlier preview of its pages
export const rememberBlud = (): Promise<void> => rememberPages('4138', pageIds);
// The walkthrough each page is remembered for (null for none)
export const walkthroughsOf = (ids: string[]): Promise<(string | null)[]> =>
  Promise.all(ids.map((id) => previewPageWalkthroughs.get(id)));

// Runs the feature, unmounting what it mounted when the test ends
export const populate = async (): Promise<void> => {
  onTestFinished(await populateAsideContent());
};

// Opens the page preview of #BLUD, whose walkthrough id was remembered, once its sections are there; `pages` replaces
// the pages it's answered with
export const openPagePreview = async (pages: Record<string, string> = {}): Promise<void> => {
  await rememberBlud();
  fetchPages(pages);

  await populate();
  await vi.waitFor(() => expect(achievementsSection()).not.toBeNull());
};
