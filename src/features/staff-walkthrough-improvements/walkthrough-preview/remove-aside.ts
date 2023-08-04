import { walkthroughPreview } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import { pubSub } from '@ta-x-components';

const applyBody = async (): Promise<void> => {
  const main = await waitForElement('.page main');
  main.parentElement.classList.add('no-aside');
  main.classList.add('no-aside');

  const aside = await waitForElement('.page aside');
  aside.remove();
};

const listen = () => {
  pubSub.subscribe('walkthroughPreview:removeAside', applyBody);
};

export const removeAside = async (): Promise<void> => {
  listen();

  if (walkthroughPreview.populateAsideContent) return;

  await applyBody();
};

export default { removeAside };
