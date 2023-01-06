import { waitForElement } from '@ta-x-utilities';
import { StaffRegex } from '../../../globals/regex';

const applyBody = async(): Promise<void> => {
  const main = await waitForElement('.page main');
  main.parentElement.classList.add('no-aside');
  main.classList.add('no-aside');

  const aside = await waitForElement('.page aside');
  aside.remove();
};

export default async(): Promise<void> => {
  if (!StaffRegex.Walkthroughs.Test.preview()) return;

  await applyBody();
};
