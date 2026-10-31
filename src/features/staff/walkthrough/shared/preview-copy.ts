import { type MemoizedFetchOptions, memoizedFetches, memoizeFetchDocument } from '@ta-x-fetch';

import { walkthroughPreviewUrl } from './walkthrough-markup';

// A walkthrough's preview, manage page and public page are kept for a few hours, so its pages, thanks and achievements
// are that fresh (as the preview's setting says). A change on its manage page or walkthrough page drops them sooner
// (walkthrough-preview/postback-command.ts)
export const keptFor4Hours: MemoizedFetchOptions = { deleteAfter: { value: 4, period: 'hours' } };

// A walkthrough's preview, as both features read it (the manage page's table links, the preview's side column)
export const readWalkthroughPreview = (walkthroughId: string): Promise<Document> =>
  memoizeFetchDocument(walkthroughPreviewUrl(walkthroughId), {}, keptFor4Hours);

// Drops the cached copy of a walkthrough's preview, so it's read afresh. A cache that can't be written just means the
// copy stays until it's out of date
export const forgetWalkthroughPreview = async (walkthroughId: string): Promise<void> => {
  await memoizedFetches.delete(walkthroughPreviewUrl(walkthroughId)).catch(() => undefined);
};
