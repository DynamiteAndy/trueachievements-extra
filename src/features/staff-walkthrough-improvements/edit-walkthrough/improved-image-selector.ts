import { editWalkthrough } from '@ta-x-globals';
import { template } from '@ta-x-helpers';
import { waitForElement, extractBetween } from '@ta-x-utilities';
import html from './edit-walkthrough.html';
import styles from './styles';

const listen = (): void => {
  document.addEventListener('click', ({ target }) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (target.closest(`[aria-label='Add Image'], .${styles.jsImprovedImageSelector}`) !== null) {
      return;
    }

    const imageSelector = document.querySelector(`.${styles.jsImprovedImageSelector}`) as HTMLElement;

    if (imageSelector.style.display === 'block') {
      imageSelector.style.display = 'none';
    }
  });

  window.addEventListener('blur', () => {
    if (document.activeElement === document.querySelector('#txtWalkthrough_ifr')) {
      const imageSelector = document.querySelector(`.${styles.jsImprovedImageSelector}`) as HTMLElement;

      if (imageSelector.style.display !== 'block') {
        return;
      }

      imageSelector.style.display = 'none';
    }
  });
};

export const improveImageSelector = async (): Promise<void> => {
  if (!editWalkthrough.improvedImageSelector) {
    return;
  }

  const imageContainer = await waitForElement('#oWalkthroughImageViewer, [id=" oWalkthroughImageViewer"]');

  if (!imageContainer) {
    return;
  }

  if (imageContainer.id === ' oWalkthroughImageViewer') {
    imageContainer.id = 'oWalkthroughImageViewer';
  }

  imageContainer.classList.add(styles.improvedImageSelector, styles.jsImprovedImageSelector);

  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const stickyImageHeader = parsedDocument.querySelector(`.${styles.jsImprovedImageSelectorContainer}`);
  const imageViewer = await waitForElement('.imageviewer', imageContainer);
  const imageLink = await waitForElement('.addimages a', imageContainer);

  imageContainer.insertBefore(stickyImageHeader, imageViewer);
  stickyImageHeader.appendChild(imageViewer.querySelector('.itemname, .noimages'));
  stickyImageHeader.appendChild(imageLink);

  ([...imageViewer.querySelectorAll('.ivimage a')] as HTMLElement[]).forEach((imageAnchor) => {
    const clonedImageTitle = parsedDocument.querySelector(`.${styles.jsImprovedImageSelectorImageTitle}`).cloneNode(true);
    const imageTitle = template(clonedImageTitle as HTMLElement, {
      element: imageAnchor.querySelector('img')
    });
    imageTitle.innerText = extractBetween("'", imageTitle.innerText);

    imageAnchor.appendChild(imageTitle);
  });

  listen();
};

export default { improveImageSelector };
