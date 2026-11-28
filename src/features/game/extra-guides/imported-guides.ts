import { logger } from '@ta-x-lib';
import { IndexedDbService, parseStoredJson } from '@ta-x-storage';

import type { ImportedGuide } from './imported-guide';

// Guides read from a guide site's own page (sites that block background requests, e.g. XboxAchievements' Cloudflare
// challenge). IndexedDB belongs to each site, so the guide site can't write to TrueAchievements' one: it hands the
// guides over through a Tampermonkey value (the only storage our script shares across sites), and the next
// TrueAchievements page moves them into IndexedDB and deletes the value, so Tampermonkey storage doesn't keep filling.
export const importedGuides = new IndexedDbService<ImportedGuide[]>('trueachievements-extra', 'imported-guides');

const handOverPrefix = 'importedGuides:';

// A guide page's guides are kept under its address, without any query or hash and always ending in a slash, so the
// link the user saved and the page they visited match however each was written. Its site's bare domain and http
// become https://www., where the guide sites redirect them (PlaystationTrophies and Gamertag Nation do): the
// page hands its guides over from where it landed, so a link saved without them would otherwise wait for good
export const importedGuidesKey = (url: string): string => {
  const { hostname, pathname } = new URL(url);
  const host = hostname.split('.').length === 2 ? `www.${hostname}` : hostname;

  return `https://${host}${pathname.endsWith('/') ? pathname : `${pathname}/`}`;
};

const handOverKey = (url: string): string => `${handOverPrefix}${importedGuidesKey(url)}`;

// Every guide page's guides still being handed over, by their Tampermonkey key
const handOverKeys = (): string[] => GM_listValues().filter((key) => key.startsWith(handOverPrefix));

// On the guide site: hand the page's guides over to TrueAchievements
export const handOverImportedGuides = (url: string, guides: ImportedGuide[]): void => {
  GM_setValue(handOverKey(url), JSON.stringify(guides));
};

// Moves a guide page's handed over guides, if there are any, into IndexedDB. A value that isn't a list of guides can
// never be stored, so it's dropped, or it would fail on every page; one that fails to store waits for a later page
const takeHandedOverGuides = async (key: string): Promise<void> => {
  const value: unknown = GM_getValue(key, '');

  if (value === '') {
    return;
  }

  const guides = parseStoredJson(key, value);

  if (!Array.isArray(guides)) {
    logger.warn('import-guides', `"${key}" isn't a list of guides, so it's dropped`);
    GM_deleteValue(key);
    return;
  }

  await importedGuides.set(key.slice(handOverPrefix.length), guides as ImportedGuide[]);
  GM_deleteValue(key);
};

// On TrueAchievements: move every guide page's handed over guides into IndexedDB
export const takeAllHandedOverGuides = async (): Promise<void> => {
  for (const key of handOverKeys()) {
    await takeHandedOverGuides(key);
  }
};

// The guides read from a guide page when the user last visited it, or null if they haven't
export const getImportedGuides = async (url: string): Promise<ImportedGuide[] | null> => {
  await takeHandedOverGuides(handOverKey(url));

  return importedGuides.get(importedGuidesKey(url));
};

// Opens the guide page in a background tab, where our script reads its guides (the user's browser passes the site's
// check like any visit), then stores the guides it hands over and closes the tab. Resolves once they're stored, or
// once the tab is closed before they arrive (by the user), without them.
export const importGuidesFrom = (url: string): Promise<void> =>
  new Promise((resolve) => {
    const key = handOverKey(url);
    const tab = GM_openInTab(url, { active: false, insert: true, setParent: true });
    // Storing them failing (IndexedDB) still ends the import, or the row stayed "Importing…" and the tab open; the
    // handed-over guides stay where they are, for the maintenance task to take on a later page
    const take = async (): Promise<void> => {
      try {
        await takeHandedOverGuides(key);
      } catch (error) {
        logger.warn('import-guides', "the handed-over guides couldn't be stored", error);
      } finally {
        resolve();
        tab.close();
      }
    };
    const listenerId = GM_addValueChangeListener(key, (_name, _oldValue, newValue) => {
      if (!newValue) {
        return;
      }

      GM_removeValueChangeListener(listenerId);
      void take();
    });

    tab.onclose = () => {
      GM_removeValueChangeListener(listenerId);
      resolve();
    };
  });

// Forgets one guide page's stored guides, however its address was written
export const forgetImportedGuides = (url: string): Promise<void> => importedGuides.delete(importedGuidesKey(url));
