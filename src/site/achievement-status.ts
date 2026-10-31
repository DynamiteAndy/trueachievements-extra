// Whether a game's achievements or DLC page lists every achievement (its status set to All), not only those Won or Not
// Won; null on a page with no status to set (a challenges page, for one), as callers count that case differently
export const allAchievementsShown = (doc: Document = document): boolean | null =>
  doc.querySelector('#rdoAllAchievements')?.hasAttribute('checked') ?? null;

// Whether a game's achievements or DLC page lists only the achievements won (its status set to Won)
export const wonAchievementsShown = (doc: Document = document): boolean =>
  doc.querySelector('#rdoWonAchievements')?.hasAttribute('checked') ?? false;
