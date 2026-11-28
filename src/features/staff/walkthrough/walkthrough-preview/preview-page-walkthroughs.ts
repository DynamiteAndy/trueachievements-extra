import { carryOverToIndexedDb, IndexedDbService } from '@ta-x-storage';

// Which walkthrough each page belongs to, by page id, remembered from the walkthrough's preview so its page previews
// find it without asking. An entry expires a while after it was last read or saved, so pages not previewed again
// don't keep it forever
export const previewPageWalkthroughs = new IndexedDbService<string>(
  'trueachievements-extra',
  'walkthrough-preview-page-walkthroughs'
);

// Where older versions kept them: one growing map of [walkthrough id, its page ids] entries in Tampermonkey storage
const legacyKey = 'previewWalkthroughId';

const pageWalkthroughs = carryOverToIndexedDb(
  legacyKey,
  previewPageWalkthroughs,
  ([walkthroughId, pageIds]): [string, string][] =>
    Array.isArray(pageIds) ? (pageIds as string[]).map((pageId) => [pageId, walkthroughId]) : [],
  { value: 90, period: 'days' }
);

// Started by the maintenance task
export const carryOverPreviewPageWalkthroughs = pageWalkthroughs.carryOver;

// The walkthrough a page belongs to, or null. A store that can't be read just means asking for the walkthrough
export const getPageWalkthrough = pageWalkthroughs.get;

// Remembers which walkthrough each of its pages belongs to; saved each time the walkthrough is shown, which keeps them
// longer
export const rememberPages = (walkthroughId: string, pageIds: string[]): Promise<void> =>
  pageWalkthroughs.remember(pageIds.map((pageId) => [pageId, walkthroughId]));
