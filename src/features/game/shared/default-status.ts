import { isFreshArrival, waitForElementWhileParsing } from '@ta-x-page';
import { pageParam, signedInGamerId } from '@ta-x-site';

// Picks the user's default status (All / Won / Not Won), while `enabled`, on arriving at a game's achievements,
// challenges or DLC page. `statusId` is the id of the site's radio for it; `gamerIdTest` tells whether the page's URL
// names a gamer. Only on arriving: after the user picks another, the site posts the page back to itself, and that pick
// sticks. Not on another gamer's page (its `gamerid` isn't the signed-in gamer's), and not when every item is already
// won, as the filter would change nothing.
// Picking one posts the page back, so it goes as early as it can: once the filter is parsed and one item not won is,
// without waiting for the rest of a long list (a post back sent mid-parse works). Resolves whether it posted back, so
// the page's other tasks can leave it to the page that comes back
export const setDefaultStatus = async (
  enabled: boolean,
  statusId: string,
  gamerIdTest: (str?: string) => boolean
): Promise<boolean> => {
  if (!enabled || !isFreshArrival()) {
    return false;
  }

  if (gamerIdTest() && pageParam('gamerid') !== signedInGamerId()) {
    return false;
  }

  const status = await waitForElementWhileParsing<HTMLInputElement>(`#${statusId}`);
  if (!status || status.hasAttribute('checked')) {
    return false;
  }

  // An item not won: not .w, and not a challenges list's "Expired Challenges" heading row (<li class="heading">)
  if (!(await waitForElementWhileParsing('.ach-panels li:not(.w):not(.heading)'))) {
    return false;
  }

  status.click();
  return true;
};
