import { carryOverToIndexedDb, IndexedDbService } from '@ta-x-storage';

// Each walkthrough thread's walkthrough page (found in its first posts or typed into the ask panel), by thread id. An
// entry expires unless it is read or saved again, so threads not visited again don't keep it forever
export const ownerProgressUrls = new IndexedDbService<string>(
  'trueachievements-extra',
  'walkthrough-owner-progress-urls'
);

// Where earlier versions kept them: one growing map of [thread id, url] entries in Tampermonkey storage
const legacyKey = 'walkthroughOwnerProgressUrl';

const urls = carryOverToIndexedDb(
  legacyKey,
  ownerProgressUrls,
  ([threadId, url]) => (typeof url === 'string' ? [[threadId, url]] : []),
  { value: 90, period: 'days' }
);

// Started by the maintenance task
export const carryOverOwnerProgressUrls = urls.carryOver;

// The thread's remembered walkthrough page, or null. A store that can't be read just means looking the walkthrough up
// again
export const getOwnerProgressUrl = urls.get;

// Saved each time the thread's walkthrough is shown, which keeps it from expiring
export const rememberOwnerProgressUrl = (threadId: string, url: string): Promise<void> =>
  urls.remember([[threadId, url]]);
