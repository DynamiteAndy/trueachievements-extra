import { log } from 'missionlog';
import { waitForElement } from '@ta-x-utilities';
import regex from '../../regex';

// Elements -------
const applyBody = async(): Promise<void> => {
  log.debug('Walkthrough-Preview', 'Starting - applyBody');

  const main = await waitForElement('.page main');
  main.parentElement.classList.add('no-aside');
  main.classList.add('no-aside');

  const aside = await waitForElement('.page aside');
  aside.remove();

  log.debug('Walkthrough-Preview', 'Finished - applyBody');
};

const listen = (): void => {
  // Do nothing yet!
};

export default async(): Promise<void> => {
  if (!regex.test.staff.walkthrough.preview(window.location.href)) return;

  log.debug('Walkthrough-Preview', 'Starting');

  await applyBody();
  listen();

  log.debug('Walkthrough-Preview', 'Finished');
};
