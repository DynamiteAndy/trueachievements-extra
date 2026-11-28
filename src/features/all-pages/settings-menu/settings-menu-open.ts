import { signal } from '@preact/signals';

// Whether the settings menu is open. The wrench (in the site's header) and the menu (after the site's gamer panel) are
// mounted in different places, so both read this instead of the feature re-rendering them.
export const settingsMenuOpen = signal(false);

export const closeSettingsMenu = (): void => {
  settingsMenuOpen.value = false;
};

// The wrench opens and closes it, as the site's gamer toggle does its panel
export const toggleSettingsMenu = (): void => {
  settingsMenuOpen.value = !settingsMenuOpen.peek();
};
