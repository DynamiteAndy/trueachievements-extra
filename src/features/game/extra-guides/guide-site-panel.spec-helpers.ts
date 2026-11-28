import { find, submitAsk } from '@ta-x-test';
import { EditableHeaderStyles } from '@ta-x-ui';

import styles from './styles';

// A guide link row's links: its Import (in the row's status, read out as it changes) and its Remove; and the header's
// + or pencil
export const guideLinkSelectors = {
  row: `.${styles.guideLinksList} > li`,
  importLink: 'li > span > a[href="#"]',
  removeLink: 'a[title="Remove"]',
  addLink: `.${EditableHeaderStyles.editableHeader} > a`
} as const;

// A guide site's tab panel in the Extra Guides section, by the site's id ('xbox-achievements'): its id is
// ta-x-tabs-<the tab group's id>-<the site's id>
export const guideSiteTabPanel = (siteId: string): string => `[id^="ta-x-tabs-"][id$="-${siteId}"]`;

// For the guide-site specs (achievement and achievements pages): what they read in one guide site's panel of the Extra
// Guides section, the site given by its id
export const guideSitePanel = (siteId: string) => {
  const tabPanel = guideSiteTabPanel(siteId);
  // What the site's tab shows (its loader's box). Null where a test checks it isn't there
  const panel = (): HTMLElement | null => document.querySelector<HTMLElement>(`${tabPanel} > *`);
  // Its list of guide pages, and the form that adds one
  const links = (): HTMLElement => find(`.${styles.guideLinks}`, panel());

  return {
    panel,
    // The guide pages it lists
    rows: (): Element[] => [...find(tabPanel).querySelectorAll(guideLinkSelectors.row)],
    // The field asking for a guide page, null while it isn't asking
    field: (): HTMLInputElement | null =>
      find(tabPanel).querySelector<HTMLInputElement>(`.${styles.guideLinks} input[type="text"]`),
    // The ask form's button (Save, Add or Change)
    button: (): HTMLInputElement => find<HTMLInputElement>('input[type="submit"]', links()),
    // Types a guide page's address in and saves it
    submit: (url: string): MouseEvent => submitAsk(links(), url),
    // Every imported guide shown among the achievement's solutions, from any site
    solutions: (): Element[] => [...document.querySelectorAll(`.${styles.achievementGuideSolution}`)]
  };
};
