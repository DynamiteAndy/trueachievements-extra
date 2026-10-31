import { timed } from '@ta-x-lib';
import { mount, waitForElement, waitForSideColumnSlot } from '@ta-x-page';

import { gameLink, getAchievementTitle, loadGuideSite, type LoadedGuideSite } from './guide-site-links';
import { guideSites } from './guide-sites';
import { ImportGuides } from './ImportGuides';

import type { GuideSiteId } from './guide-site-list';

const noStop = (): void => undefined;

// The Extra Guides section, with a tab for each guide site that's turned on (none: no section), above the side
// column's first full section. Each site's links and guide for the achievement are loaded first, so the section and the
// achievement's imported solutions show complete. Mounted whatever the sites' settings, as they apply live
// (ImportGuides reads them); returns the stop, which takes the section and the solutions away
export const importGuides = async (): Promise<() => void> => {
  if (!(await waitForElement(gameLink))) {
    return noStop;
  }

  const achievementTitle = await getAchievementTitle();
  // Every site, the ones turned off too, so turning one on shows it at once
  const initialLoaded = Object.fromEntries(
    await timed('Guide sites: load', () =>
      Promise.all(guideSites.map(async (site) => [site.id, await loadGuideSite(site, achievementTitle)] as const))
    )
  ) as Record<GuideSiteId, LoadedGuideSite>;

  const slot = await waitForSideColumnSlot();
  if (!slot) {
    return noStop;
  }

  const root = mount(
    <ImportGuides sites={guideSites} initialLoaded={initialLoaded} achievementTitle={achievementTitle} />,
    slot.parent,
    slot.before
  );

  return root.unmount;
};
