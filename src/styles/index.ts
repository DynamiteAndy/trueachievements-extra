import * as fs from 'fs';
import { Constants } from '../constants';
import { waitForElement } from '../scripts/helpers/wait';

export const apply = async (): Promise<void> => {
  (await waitForElement('body', document.documentElement)).classList.add(Constants.Styles.root);
  GM_addStyle(fs.readFileSync('./dist/styles/trueachievements-extras.styles.css', 'utf8'));
};
