import { fetchOk, memoizeFetchExtract } from '@ta-x-fetch';
import { callAll } from '@ta-x-lib';
import { ProductRegex, GamesRegex } from '@ta-x-site';
import { settings, whileSetting } from '@ta-x-storage';

import { saleRows } from '../../sale-tables';
import { signedInGamer } from '../../signed-in-gamer';
import { hideSaleRow } from '../hide-sale-row';

const { hideOwnedItems } = settings.news.sales;

// The gamer's games by address, and the names of those they've completed (which counts their DLC as owned), as sets,
// since each sale item looks itself up in them
type OwnedGames = { urls: Set<string>; completeNames: Set<string> };

const isGame = (potentialGame: HTMLAnchorElement): boolean => GamesRegex.Test.achievementsUrl(potentialGame.href);
const isDLC = (potentialDLC: HTMLAnchorElement): boolean => GamesRegex.Test.individualDlcUrl(potentialDLC.href);
const isProduct = (potentialProduct: HTMLAnchorElement): boolean => ProductRegex.Test.productUrl(potentialProduct.href);
const hasGame = (game: HTMLAnchorElement, ownedGames: OwnedGames): boolean =>
  ownedGames.urls.has(new URL(game.href).pathname);

const hasDLC = (dlc: HTMLAnchorElement, ownedGames: OwnedGames): boolean =>
  ownedGames.completeNames.has(GamesRegex.Extract.gameName(dlc.href));

// A product's link followed only by games and DLC is a bundle, owned once every one of them is
const ownsBundle = (gameOrBundle: HTMLAnchorElement[], ownedGames: OwnedGames): boolean => {
  if (!isProduct(gameOrBundle[0])) {
    return false;
  }

  const { games, dlc } = getBundleItems(gameOrBundle);

  return (
    games.length + dlc.length === gameOrBundle.length - 1 &&
    games.every((game) => hasGame(game, ownedGames)) &&
    dlc.every((dlcItem) => hasDLC(dlcItem, ownedGames))
  );
};

const getBundleItems = (
  gameOrBundle: HTMLAnchorElement[]
): { games: HTMLAnchorElement[]; dlc: HTMLAnchorElement[] } => {
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

// The request the site's own games list sends for a page of the gamer's games: its `params` is the list's name, then
// its options as a query, encoded as one value (spaces as %20, as the site sends them). The bare `executeformfunction`
// key is kept as the site writes it
const gamesListUrl = (gamerPageUrl: string, gamerId: string): string => {
  const options: Record<string, string> = {
    ddlPlatformIDs: '',
    ddlGenreIDs: '',
    asdGamePropertyID: '-1',
    oGamerGamesList_Order: 'LastScanned desc',
    oGamerGamesList_Page: '1',
    oGamerGamesList_ItemsPerPage: '100',
    oGamerGamesList_TimeZone: 'GMT Standard Time',
    oGamerGamesList_ShowAll: 'True',
    txtGamerID: gamerId,
    txtTARatioType: 'MyTARatio',
    txtDLCInclusionSetting: 'AllDLC',
    txtBoostListOnly: 'False',
    txtShowDLCInfo: 'True',
    txtConfirmedGenres: 'False',
    txtCompleteOnly: 'False',
    txtSiteLeaderboardFilterDefinitionID: '0',
    txtGamePropertyID: '0'
  };
  const query = Object.entries(options)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return `${gamerPageUrl}/games?executeformfunction&function=AjaxList&params=${encodeURIComponent(`oGamerGamesList|&${query}`)}`;
};

// What's kept from the gamer's games list: the same two lists, as arrays (kept as JSON)
type OwnedGameLists = { urls: string[]; completeNames: string[] };

// The gamer's whole games list (every game in one answer) is several MB for a big library, and only these two lists
// are read from it: they're what's cached, so a sale article visited later that day skips parsing the list. Its fetch
// is fetchOk's, looked up at each call
const fetchOwnedGameLists = memoizeFetchExtract<OwnedGameLists>(
  (url, options) => fetchOk(url, options),
  (gamesList) => {
    const games = [...gamesList.querySelectorAll<HTMLAnchorElement>('#oGamerGamesList .smallgame a')];

    return {
      urls: games.map((game) => new URL(game.href).pathname),
      completeNames: games
        .filter((game) => game.closest('tr')?.classList.contains('green'))
        .map((game) => GamesRegex.Extract.gameName(game.href))
    };
  },
  '#owned-games'
);

// Null when there's no signed-in gamer, or they have no games
const getOwnedGames = async (): Promise<OwnedGames | null> => {
  const gamer = await signedInGamer();

  if (!gamer) {
    return null;
  }

  const url = gamesListUrl(gamer.gamerPage, gamer.gamerId);
  const { urls, completeNames } = await fetchOwnedGameLists(url, { method: 'POST' });

  return urls.length === 0 ? null : { urls: new Set(urls), completeNames: new Set(completeNames) };
};

// Hides each sale item the gamer owns; returns what gives them back. Turned off while the gamer's games are looked up,
// it hides nothing (rather than hiding the rows for its undo to give them straight back)
const hideOwnedRows = async (aborted: AbortSignal): Promise<() => void> => {
  const giveBacks: (() => void)[] = [];
  const giveAllBack = (): void => callAll(giveBacks);
  const ownedGames = await getOwnedGames();

  if (!ownedGames || aborted.aborted) {
    return giveAllBack;
  }

  const itemsOnSale = [...document.querySelectorAll<HTMLTableCellElement>(`${saleRows} td:first-child`)];

  for (const itemOnSale of itemsOnSale) {
    const gameOrBundle = [...itemOnSale.querySelectorAll('a')];
    let shouldHide = false;

    // The site's ad rows (a cell spanning the table with an ad slot in it, added once the page has loaded) have no link
    if (gameOrBundle.length === 0) {
      continue;
    }

    // A lone link that's neither a game nor a DLC (a product's) is never hidden
    if (gameOrBundle.length === 1) {
      const item = gameOrBundle[0];

      if (isGame(item)) {
        shouldHide = hasGame(item, ownedGames);
      } else if (isDLC(item)) {
        shouldHide = hasDLC(item, ownedGames);
      }
    } else {
      shouldHide = ownsBundle(gameOrBundle, ownedGames);
    }

    if (shouldHide) {
      giveBacks.push(hideSaleRow(itemOnSale, 'Owned Items'));
    }
  }

  return giveAllBack;
};

// While the setting is on, live: turned off, the rows come back. Returns the stop
export default (): (() => void) => whileSetting([hideOwnedItems], () => hideOwnedItems.value, hideOwnedRows);
