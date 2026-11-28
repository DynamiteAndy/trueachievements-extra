import { durationMs, logger } from '@ta-x-lib';
import { useEffect, useState } from 'preact/hooks';

import { isGuidePageLinked } from '../guide-links';
import { findGuide, saveGuideLinks, type ShownGuide } from '../guide-site-links';
import { GuideLinks, type GuideLink } from '../GuideLinks';
import { forgetImportedGuides, getImportedGuides, importedGuidesKey, importGuidesFrom } from '../imported-guides';

import type { GuideSite } from '../guide-sites';

// How long an import runs before its row says where to look: by then the guide tab is likely waiting on the user
// (a bot check) or never got a guide page
const slowImportAfter = durationMs({ value: 30, period: 'seconds' });

interface GuideSitePanelProps {
  site: GuideSite;
  // The game's linked guide pages when the page loaded
  initialLinks: GuideLink[];
  // On an achievement page its title, which guides are matched by; null on the achievements and DLC pages
  achievementTitle: string | null;
  // The links ImportGuides already has the guide for: starting with these, the panel doesn't read them again
  guideFoundFor?: GuideLink[];
  // The site's guide for the achievement, as its links change, with the links it was found for; ImportGuides puts it
  // among the achievement's solutions
  onGuide: (guide: ShownGuide | null, foundFor: GuideLink[]) => void;
  // Its links as they change, which ImportGuides keeps for when the tab is turned off and on again
  onLinks: (links: GuideLink[]) => void;
}

// A guide site's tab: the game's linked guide pages with their guides' status, adding (reading the guides in a tab the
// browser opens), importing and removing them
export const GuideSitePanel = ({
  site,
  initialLinks,
  achievementTitle,
  guideFoundFor,
  onGuide,
  onLinks
}: GuideSitePanelProps) => {
  const [links, setLinks] = useState(initialLinks);

  const update = (url: string, changes: Partial<GuideLink>): void =>
    setLinks((current) => current.map((link) => (link.url === url ? { ...link, ...changes } : link)));

  // Drops a guide page's stored guides once no game links it (checked after this game's links were saved)
  const forget = (url: string): void => {
    if (!isGuidePageLinked(site.setting, url)) {
      forgetImportedGuides(url).catch(() => undefined);
    }
  };

  // The row shows what was read, also when the import failed (an IndexedDB error), rather than "Importing…" for good.
  // An import that runs on (no answer from the guide tab) keeps going: the row says where to look meanwhile
  const importLink = async (url: string): Promise<void> => {
    update(url, { importing: true });
    const slowTimer = setTimeout(() => update(url, { slow: true }), slowImportAfter);

    try {
      await importGuidesFrom(url);
    } catch (error) {
      logger.warn('import-guides', `${url}'s guides couldn't be imported`, error);
    } finally {
      clearTimeout(slowTimer);
    }

    const guides = await getImportedGuides(url).catch(() => null);
    update(url, { importing: false, slow: false, guides: guides?.length ?? null });
  };

  // Reads a new link's guides, unless they've been read already
  const readLink = async (url: string): Promise<void> => {
    const guides = await getImportedGuides(url).catch(() => null);

    if (guides) {
      update(url, { guides: guides.length });
      return;
    }

    await importLink(url);
  };

  // A new link is saved and its guides read straight away; false if it isn't one of the site's guide pages
  const add = (value: string): boolean => {
    if (!site.isGuidePage(value)) {
      return false;
    }

    const url = importedGuidesKey(value);

    if (links.some((link) => link.url === url)) {
      return true;
    }

    const next = [...(site.multiple ? links : []), { url, guides: null, importing: false }];
    setLinks(next);
    saveGuideLinks(site, next);

    if (!site.multiple) {
      links.forEach((link) => forget(link.url));
    }

    // Not awaited: the row shows "Importing…" meanwhile
    void readLink(url);

    return true;
  };

  const remove = (url: string): void => {
    const next = links.filter((link) => link.url !== url);
    setLinks(next);
    saveGuideLinks(site, next);
    forget(url);
  };

  useEffect(() => onLinks(links), [links, onLinks]);

  // The achievement's guide follows the links: the first page with one, once its guides have been read
  useEffect(() => {
    if (links === guideFoundFor) {
      return undefined;
    }

    let cancelled = false;

    // No guide shown if the imported guides can't be read (an IndexedDB error)
    void findGuide(links, achievementTitle)
      .catch(() => null)
      .then((guide) => {
        if (!cancelled) {
          onGuide(guide, links);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [links, achievementTitle, guideFoundFor, onGuide]);

  return (
    <GuideLinks
      site={site.guide.name}
      links={links}
      multiple={site.multiple ?? false}
      summary={site.summary}
      askInformation={site.askInformation}
      askLabel={site.askLabel}
      onAdd={add}
      onRemove={remove}
      onImport={(url) => {
        void importLink(url);
      }}
    />
  );
};
