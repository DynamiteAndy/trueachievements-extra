import { applyLive } from '@ta-x-storage';
import { AskLoader, useTabs } from '@ta-x-ui';
import { useLayoutEffect, useMemo, useState } from 'preact/hooks';

import { GuideSitePanel } from '../GuideSitePanel';
import { ImportedSolutions } from '../ImportedSolutions';
import styles from '../styles';
import { TabbedSection } from '../TabbedSection';

import type { LoadedGuideSite, ShownGuide } from '../guide-site-links';
import type { GuideSiteId } from '../guide-site-list';
import type { GuideSite } from '../guide-sites';
import type { GuideLink } from '../GuideLinks';

interface ImportGuidesProps {
  // Every guide site, in their tabs' order: each has a tab while it's turned on in the settings menu
  sites: GuideSite[];
  // Every site's links and guide, loaded before the section mounts, so a site shows complete, and at once when it's
  // turned on
  initialLoaded: Record<GuideSiteId, LoadedGuideSite>;
  // On an achievement page its title; null on the achievements and DLC pages
  achievementTitle: string | null;
}

// A tab turned off mid-import lost the import's result with its state: back on, the page offers Import again rather
// than "Importing…" for good
const startingLinks = (links: GuideLink[]): GuideLink[] =>
  links.some(({ importing }) => importing) ? links.map((link) => ({ ...link, importing: false })) : links;

const sameGuide = (a: ShownGuide | null, b: ShownGuide | null): boolean =>
  a?.url === b?.url && a?.guide.title === b?.guide.title;

// A site as loaded, with the links its guide was found for: a tab that starts with those has nothing to look up. A tab
// turned off before its look-up finished starts with links the guide wasn't found for, and looks again
type ShownGuideSite = LoadedGuideSite & { guideFoundFor: GuideLink[] };

// The side column section of a game's achievements, DLC and achievement pages: a tabbed section (like the site's
// Popular Content box) with a tab for each guide site turned on, and none while no site is. On an achievement page, the
// sites' guides go at the top of its solutions in the sites' order. The sites' settings apply live (read with .value):
// a site turned on gets its tab and guide at once (every site was loaded first), one turned off loses them, and
// removing the selected tab selects the first left
export const ImportGuides = ({ sites, initialLoaded, achievementTitle }: ImportGuidesProps) => {
  const [loaded, setLoaded] = useState(
    () =>
      Object.fromEntries(
        Object.entries(initialLoaded).map(([id, site]) => [id, { ...site, guideFoundFor: site.links }])
      ) as Record<GuideSiteId, ShownGuideSite>
  );

  const shown = sites.filter(({ enabled }) => enabled.value);

  const tabs = useTabs(shown[0]?.id ?? '');
  const { select } = tabs;
  const selected = shown.some(({ id }) => id === tabs.selected) ? tabs.selected : (shown[0]?.id ?? '');

  // Registered before the next paint, and gone with the section (a useEffect cleanup runs after the next paint)
  useLayoutEffect(() => applyLive(...sites.map(({ enabled }) => enabled)), [sites]);

  // Each site's tab hands up its guide and its links as they change, so a site turned off and on again comes back as
  // it was left. The same every render, so the tabs' effects don't re-run
  const handlers = useMemo(
    () =>
      Object.fromEntries(
        sites.map(({ id }) => [
          id,
          {
            onGuide: (guide: ShownGuide | null, guideFoundFor: GuideLink[]) =>
              setLoaded((current) =>
                sameGuide(current[id].guide, guide) && current[id].guideFoundFor === guideFoundFor
                  ? current
                  : { ...current, [id]: { ...current[id], guide, guideFoundFor } }
              ),
            onLinks: (links: GuideLink[]) =>
              setLoaded((current) =>
                current[id].links === links ? current : { ...current, [id]: { ...current[id], links } }
              )
          }
        ])
      ),
    [sites]
  );

  // The same until a shown site or a guide changes, so the solutions aren't rendered again every render
  const shownIds = shown.map(({ id }) => id).join(' ');
  const solutions = useMemo(
    () =>
      sites.flatMap((site) => {
        const { guide } = loaded[site.id];
        return guide && shownIds.split(' ').includes(site.id) ? [{ site, guide }] : [];
      }),
    [sites, shownIds, loaded]
  );

  if (shown.length === 0) {
    return null;
  }

  return (
    <>
      <TabbedSection
        class={styles.importGuides}
        selected={selected}
        onSelect={select}
        tabGroupId={tabs.tabGroupId}
        tabs={shown.map((site) => ({
          id: site.id,
          label: site.label,
          content: (
            <AskLoader status="loaded">
              <GuideSitePanel
                site={site}
                initialLinks={startingLinks(loaded[site.id].links)}
                achievementTitle={achievementTitle}
                guideFoundFor={loaded[site.id].guideFoundFor}
                onGuide={handlers[site.id].onGuide}
                onLinks={handlers[site.id].onLinks}
              />
            </AskLoader>
          )
        }))}
      />
      <ImportedSolutions solutions={solutions} />
    </>
  );
};
