import { newsImprovements, ProductRegex } from '@ta-x-globals';
import { memoizeFetch } from '@ta-x-helpers';
import { getCookie, waitForElement } from '@ta-x-utilities';
import { GamerRegex, GamesRegex } from '@ta-x-globals';
import { pubSub } from '@ta-x-components';

type OwnedGame = { name: string; url: string; complete: boolean };

const isGame = (potentialGame: HTMLAnchorElement): boolean => GamesRegex.Test.achievementsUrl(potentialGame.href);
const isDLC = (potentialDLC: HTMLAnchorElement): boolean => GamesRegex.Test.individualDlcUrl(potentialDLC.href);
const isProduct = (potentialProduct: HTMLAnchorElement): boolean => ProductRegex.Test.productUrl(potentialProduct.href);
const isBundle = (gameOrBundle: HTMLAnchorElement[]): boolean => {
  if (!isProduct(gameOrBundle[0])) {
    return false;
  }

  const { games, dlc } = getBundleItems(gameOrBundle);
  return games.length + dlc.length === gameOrBundle.length - 1;
};

const hasGame = (game: HTMLAnchorElement, ownedGames: OwnedGame[]): boolean =>
  !!ownedGames.find((g) => g.url === new URL(game.href).pathname);

const hasDLC = (dlc: HTMLAnchorElement, ownedGames: OwnedGame[]): boolean => {
  const gameName = GamesRegex.Extract.gameName(dlc.href);
  return !!ownedGames.find((g) => g.name === gameName && g.complete);
};

const hasBundle = (bundle: HTMLAnchorElement[], ownedGames: OwnedGame[]): boolean => {
  const { games, dlc } = getBundleItems(bundle);
  const allGames = games.every((game) => hasGame(game, ownedGames));
  const allDLC = dlc.every((dlcItem) => hasDLC(dlcItem, ownedGames));

  return allGames && allDLC;
};

const getBundleItems = (gameOrBundle: HTMLAnchorElement[]): { games: HTMLAnchorElement[], dlc: HTMLAnchorElement[] } => {
  const games: HTMLAnchorElement[] = [];
  const dlc: HTMLAnchorElement[] = [];

  const otherSaleItems = gameOrBundle.slice(1);
  otherSaleItems.forEach((gameOrDlc) => {
    if (isGame(gameOrDlc)) {
      games.push(gameOrDlc);
    } else if (isDLC(gameOrDlc)) {
      dlc.push(gameOrDlc);
    }
  });

  return { games, dlc };
};

const getOwnedGames = async (): Promise<OwnedGame[]> => {
  const gamerPage = await waitForElement('nav a.gamer-page, .nav-gamer .gamer-header a.full-link') as HTMLAnchorElement;

  if(!gamerPage) {
    return [];
  }

  if (!GamerRegex.Test.gamerUrl(gamerPage.href)) {
    return [];
  }

  const gamerId = getCookie('GamerID');

  if (!gamerId) {
    return [];
  }

  const gamesResponse = await memoizeFetch(
    `${gamerPage.href}/games?executeformfunction&function=AjaxList&params=oGamerGamesList%7C%26ddlPlatformIDs%3D%26ddlGenreIDs%3D%26asdGamePropertyID%3D-1%26oGamerGamesList_Order%3DLastScanned%20desc%26oGamerGamesList_Page%3D1%26oGamerGamesList_ItemsPerPage%3D100%26oGamerGamesList_TimeZone%3DGMT%20Standard%20Time%26oGamerGamesList_ShowAll%3DTrue%26txtGamerID%3D${gamerId}%26txtTARatioType%3DMyTARatio%26txtDLCInclusionSetting%3DAllDLC%26txtBoostListOnly%3DFalse%26txtShowDLCInfo%3DTrue%26txtConfirmedGenres%3DFalse%26txtCompleteOnly%3DFalse%26txtSiteLeaderboardFilterDefinitionID%3D0%26txtGamePropertyID%3D0`,
    { method: 'POST' }
  );

  const guideDocument = new DOMParser().parseFromString(gamesResponse, 'text/html');
  return ([...guideDocument.querySelectorAll('#oGamerGamesList .smallgame a')] as HTMLAnchorElement[]).map(
    (a) => ({
      name: GamesRegex.Extract.gameName(a.href),
      url: new URL(a.href).pathname,
      complete: a.closest('tr')?.classList.contains('green')
    })
  );
};

const applyBody = async (): Promise<void> => {
  const ownedGames = await getOwnedGames();

  if (ownedGames.length === 0) {
    return;
  }

  const itemsOnSale = [...document.querySelectorAll('table.sale tbody tr td:first-child')] as HTMLTableCellElement[];

  for (const itemOnSale of itemsOnSale) {
    const gameOrBundle = [...itemOnSale.querySelectorAll('a')] as HTMLAnchorElement[];
    let hideRow = false;

    if (gameOrBundle.length === 1) {
      const item = gameOrBundle[0];

      if (isGame(item)) {
        hideRow = hasGame(item, ownedGames);
      } else if (isDLC(item)) {
        hideRow = hasDLC(item, ownedGames);
      } else if (isProduct(item)) {
        continue;
      }
    } else if (isBundle(gameOrBundle)) {
      hideRow = hasBundle(gameOrBundle, ownedGames);
    }

    if (hideRow) {
      pubSub.publish('hideableRow:hide', { element: itemOnSale, method: 'table', filterText: 'Hidden by "Hide Owned Items"' });
    }
  }
};

export default async (): Promise<void> => {
  if (!newsImprovements.sales.hideOwnedItems) {
    return;
  }

  await applyBody();
};
