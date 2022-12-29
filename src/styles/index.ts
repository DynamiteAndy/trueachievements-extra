import * as fs from 'fs';
import { log } from 'missionlog';
import { Constants } from '../constants';
import { waitForElement } from '../scripts/helpers/wait';

export default async(): Promise<void> => {
  log.debug('Styles', 'Starting');

  if (await waitForElement('body')) {
    document.body.classList.add(Constants.Styles.root);
    GM_addStyle(fs.readFileSync('./dist/styles/trueachievements-extras.styles.css', 'utf8'));

    log.debug('Styles', 'Finished');
  } else {
    log.error('Styles', 'Failed to add, The body element was not found');
  }
};
