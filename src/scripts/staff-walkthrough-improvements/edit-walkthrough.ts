import html from '@ta-x-views/staff-walkthrough-improvements.html';
import { waitForElement, allConcurrently } from '@ta-x-utilities';
import { template } from '@ta-x-helpers';
import { Constants } from '@ta-x-globals';
import config from '../../config';
import regex, { extractBetween } from '../../regex';
import styles from '../../styles/staff-walkthrough-improvements';

const applyBody = async(): Promise<void> => {
  await allConcurrently(2, [applyImprovedImageSelector, applyTinymceThemeToggle, styles]);
};

const applyImprovedImageSelector = async(): Promise<void> => {
  if (!config.staffWalkthroughImprovements.improvedImageSelector) return;

  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const stickyImageHeader = parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorContainerJs}`);
  const imageContainer = await waitForElement('#oWalkthroughImageViewer');
  imageContainer.classList.add(Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorStyle, Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs);
  
  const imageViewer = imageContainer.querySelector('.imageviewer');
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
};

const applyTinymceThemeToggle = async(): Promise<void> => {
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const themeToggle = parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`);
  const toolbar = await waitForElement('.mce-tinymce .mce-toolbar.mce-last .mce-container-body');

  if (!toolbar) {
    return;
  }

  if (config.staffWalkthroughImprovements.tinymceTheme !== null) {
    themeToggle.setAttribute('data-ta-x-tinymce-theme', config.staffWalkthroughImprovements.tinymceTheme);
  }

  toolbar.appendChild(themeToggle);
};

const listen = (): void => {
  document.addEventListener('click', ({ target }) => {
    if (config.staffWalkthroughImprovements.improvedImageSelector) {
      if ((target as HTMLElement)?.closest('[aria-label="Add Image"]') === null &&
      (target as HTMLElement)?.closest(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`) === null) {
        const imageSelector = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`) as HTMLElement;

        if (imageSelector.style.display === 'block') {
          imageSelector.style.display = 'none';
        }
      }
    }

    if ((target as HTMLElement)?.classList?.contains(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`) ||
    (target as HTMLElement)?.closest(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`) !== null) {
      const button = (target as HTMLElement).classList.contains(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`)
        ? target as HTMLElement
        : (target as HTMLElement).closest(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`) as HTMLElement;

        const currentTheme = button.getAttribute('data-ta-x-tinymce-theme');
        let newTheme: string;
        if (currentTheme === 'dark') {
          newTheme = '';
        } else {
          newTheme = 'dark';
        }

        config.staffWalkthroughImprovements.tinymceTheme = newTheme;
        button.setAttribute('data-ta-x-tinymce-theme', newTheme);
    }
  });

  if (config.staffWalkthroughImprovements.improvedImageSelector) {
    window.addEventListener('blur', () => {
      if (document.activeElement === document.querySelector('#txtWalkthrough_ifr')) {
        const imageSelector = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`) as HTMLElement;

        if (imageSelector.style.display !== 'block') return;
  
        imageSelector.style.display = 'none';
      }
    });
  }
};

export default async(): Promise<void> => {
  if (!regex.test.staff.walkthrough.editWalkthroughUrl(window.location.href)) return;

  await applyBody();
  listen();
};
