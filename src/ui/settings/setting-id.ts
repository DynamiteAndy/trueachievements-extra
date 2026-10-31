import type { Setting } from '@ta-x-storage';

// A settings menu control's id, from its setting's key: game.achievements.individualProgress is
// ta-x-game-achievements-individual-progress
export const settingId = (setting: Setting): string =>
  `ta-x-${setting.key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/\./g, '-')}`;
