import { replacePlaceholderIcon } from './placeholder-icon';
import { SelectAllIcon } from './SelectAllIcon';

// Draws an icon in TinyMCE's own Select all button, which the site's skin leaves blank
export const addSelectAllIcon = (): Promise<void> =>
  replacePlaceholderIcon('.mce-btn[aria-label="Select all"] .mce-i-selectall', <SelectAllIcon />);
