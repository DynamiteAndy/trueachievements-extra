import { memoizeFetchDocument } from '@ta-x-fetch';

export type GameAchievementIcon = {
  /** The achievements page's sprite sheet the icon is on */
  sprite: string;
  /** The icon's position in the sheet */
  index: number;
};

export type GameAchievement = {
  title: string;
  description: string;
  id: string;
  /** The achievements page's own title link */
  link: HTMLAnchorElement;
  icon?: GameAchievementIcon;
};

// The achievements page draws its icons from sprite sheets: each row's `span.tile` has a sheet class (sms1, sms2, …)
// whose image is set in an inline <style>, and the row's id starts with its index in that sheet.
const getIconSprites = (gameDocument: Document): Map<string, string> =>
  new Map(
    [...gameDocument.querySelectorAll('style')].flatMap((style) =>
      [...style.textContent.matchAll(/\.(sms\d+)\s*\{[^}]*?url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map(
        ([, sheet, sprite]): [string, string] => [sheet, sprite]
      )
    )
  );

const getIcon = (row: HTMLElement, sprites: Map<string, string>): GameAchievementIcon | undefined => {
  const sheet = row.querySelector('.tile')?.className.match(/\bsms\d+\b/)?.[0];
  const index = Number.parseInt(row.id.split('_')[0], 10);

  const sprite = sheet ? sprites.get(sheet) : undefined;

  return sprite && !Number.isNaN(index) ? { sprite, index } : undefined;
};

// A game's achievements, read from its achievements page (its hub, `gameUrl`, doesn't list them)
export const getGameAchievements = async (gameUrl: string): Promise<GameAchievement[]> => {
  const gameDocument = await memoizeFetchDocument(`${gameUrl.replace(/\/$/, '')}/achievements`);
  const sprites = getIconSprites(gameDocument);

  return [...gameDocument.querySelectorAll<HTMLElement>('main ul.ach-panels li')].flatMap((row) => {
    const link = row.querySelector<HTMLAnchorElement>('a.title');
    if (!link) {
      return [];
    }

    return {
      title: link.textContent.trim(),
      description: row.querySelector('p')?.textContent.trim() ?? '',
      id: new URL(link.href).pathname.split('/')[1].slice(1),
      link,
      icon: getIcon(row, sprites)
    };
  });
};
