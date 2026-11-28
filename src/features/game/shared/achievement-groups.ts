import { settingsFrom, whileSetting, type EffectiveSetting, type Setting } from '@ta-x-storage';

// The site's group headers on a game's achievements, DLC and challenges pages: the base game's, then each DLC's. Read
// by collapsible groups and individual progress
export const baseGroupHeader = '.pnl-hd.no-pills.no-pr.game:not(.gamer):not(.dlc)';
export const dlcGroupHeader = '.pnl-hd.dlc';
// Every group header the page shows progress in: the base game's and each DLC's. A page with none has no DLC to
// group by
const groupHeaders = `${baseGroupHeader}, ${dlcGroupHeader}`;

// The stats in a group's header, each the group's total
export const groupStats = {
  taScore: '[title="Maximum TrueAchievement"]',
  gamerscore: '[title="Maximum Gamerscore"]',
  achievements: '[title="Maximum achievements"], [title="Maximum Achievements"]'
} as const;

export const groupTitle = (header: Element): string => header.querySelector<HTMLElement>('h2 a')?.innerText ?? '';

// The base game's header, unless the page has only the Overall DLC Stats (a DLC page's summary)
export const getBaseGroupHeader = (root: ParentNode): HTMLElement | null => {
  const header = root.querySelector<HTMLElement>(baseGroupHeader);

  return header && groupTitle(header) !== 'Overall DLC Stats' ? header : null;
};

export const getDlcGroupHeaders = (root: ParentNode): HTMLElement[] => [
  ...root.querySelectorAll<HTMLElement>(dlcGroupHeader)
];

// The headers progress is shown in, on the page itself
export const getProgressGroupHeaders = (): HTMLElement[] => [...document.querySelectorAll<HTMLElement>(groupHeaders)];

const hasDlcGroups = (): boolean => document.querySelector(groupHeaders) !== null;

// While `setting` is on, `apply` on a game with DLC groups, live: turned off, its cleanup gives the page back. A page
// without them has nothing to apply to; it stays registered, so its setting (and, for an effective setting, every
// setting it picks between) still applies live. Returns the stop
export const whileOnDlcGroups = (
  setting: Setting<boolean> | EffectiveSetting<boolean>,
  apply: (aborted: AbortSignal) => Promise<(() => void) | undefined>
): (() => void) =>
  whileSetting(
    settingsFrom(setting),
    () => setting.value,
    async (aborted) => (hasDlcGroups() ? apply(aborted) : undefined)
  );
