import { Constants, editWalkthrough } from '@ta-x-globals';
import { template } from '@ta-x-helpers';
import { waitForElement, extractBetween } from '@ta-x-utilities';
import html from './edit-walkthrough.html';

const listen = (): void => {
  document.addEventListener('click', ({ target }) => {
    if (!(target instanceof HTMLElement)) return;
    if (target.closest(`[aria-label='Add Image'], .${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`) !== null) return;
    
    const imageSelector = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`) as HTMLElement;

    if (imageSelector.style.display === 'block') {
      imageSelector.style.display = 'none';
    }
  });

  window.addEventListener('blur', () => {
    if (document.activeElement === document.querySelector('#txtWalkthrough_ifr')) {
      const imageSelector = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`) as HTMLElement;

      if (imageSelector.style.display !== 'block') return;

      imageSelector.style.display = 'none';
    }
  });
};

export const improveImageSelector = async(): Promise<void> => {
  if (!editWalkthrough.improvedImageSelector) return;

  const imageContainer = await waitForElement('#oWalkthroughImageViewer');

  if (!imageContainer) return;

  imageContainer.classList.add(
    Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorStyle,
    Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs);
  
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const stickyImageHeader = parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorContainerJs}`);
  const imageViewer = await waitForElement('.imageviewer', imageContainer);
  const imageLink = await waitForElement('.addimages a', imageContainer);

  imageContainer.insertBefore(stickyImageHeader, imageViewer);
  stickyImageHeader.appendChild(imageViewer.querySelector('.itemname, .noimages'));
  stickyImageHeader.appendChild(imageLink);

  ([...imageViewer.querySelectorAll('.ivimage a')] as HTMLElement[]).forEach(imageAnchor => {
    const clonedImageTitle = parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorImageTitleJs}`).cloneNode(true);
    const imageTitle = template(clonedImageTitle as HTMLElement, { image: imageAnchor.querySelector('img') });
    imageTitle.innerText = extractBetween("'", imageTitle.innerText);

    imageAnchor.appendChild(imageTitle);
  });

  listen();
};

export default { improveImageSelector };