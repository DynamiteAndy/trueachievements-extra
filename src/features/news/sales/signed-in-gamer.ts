import { waitForElement } from '@ta-x-page';
import { GamerRegex, signedInGamerId } from '@ta-x-site';

// The signed-in gamer's id and their gamer page's address, which the sales features read the gamer's games and
// wishlist from. Null when no gamer is signed in, or the header has no gamer page link
export const signedInGamer = async (): Promise<{ gamerId: string; gamerPage: string } | null> => {
  // Checked first: signed out there's no gamer link to wait for
  const gamerId = signedInGamerId();

  if (!gamerId) {
    return null;
  }

  const gamerPage = await waitForElement<HTMLAnchorElement>('nav a.gamer-page, .nav-gamer .gamer-header a.full-link');

  if (!gamerPage || !GamerRegex.Test.all(gamerPage.href)) {
    return null;
  }

  return { gamerId, gamerPage: gamerPage.href };
};
