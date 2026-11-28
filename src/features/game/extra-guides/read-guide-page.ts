import { whenParsed } from '@ta-x-page';
import { onHost } from '@ta-x-site';

import { guideSiteList } from './guide-site-list';
import { handOverImportedGuides } from './imported-guides';

// The guide site a hostname is on (its subdomains too), if any
const guideSiteFor = (hostname: string) => guideSiteList.find(({ host }) => onHost(hostname, host));

export const isGuideSite = (hostname: string = window.location.hostname): boolean =>
  guideSiteFor(hostname) !== undefined;

// Runs on a guide site's own game guide pages (visited by the user, or opened by an import): hands every
// achievement's guide on the page over to TrueAchievements, for that game's achievement pages to show
export const readGuidePage = async (): Promise<void> => {
  const site = guideSiteFor(window.location.hostname);

  if (!site || !site.enabled.peek() || !site.isGuidePage(window.location.href)) {
    return;
  }

  // The script starts before the page has loaded, and the guides are spread over several lists
  await whenParsed();

  // Cloudflare's check: the guide page loads in its place once the browser passes it, and is read then
  if (!document.querySelector(site.page)) {
    return;
  }

  // Handed over even when the game has no guides, so an import waiting for them finishes (with none)
  handOverImportedGuides(window.location.href, site.getGuides(document, window.location.href));
};
