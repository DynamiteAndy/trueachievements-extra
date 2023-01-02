import { waitForElement } from '@ta-x-utilities';
import regex from '../../regex';

// Elements -------
const applyBody = async(): Promise<void> => {
  const main = await waitForElement('.page main');
  main.parentElement.classList.add('no-aside');
  main.classList.add('no-aside');

  const aside = await waitForElement('.page aside');
  aside.remove();

};

export default async(): Promise<void> => {
  if (!regex.test.staff.walkthrough.preview(window.location.href)) return;

  await applyBody();
};
