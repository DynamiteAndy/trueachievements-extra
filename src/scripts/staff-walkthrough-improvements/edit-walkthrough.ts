import * as fs from 'fs';
import { log } from 'missionlog';
import config from '../../config';
import { Constants } from '../../constants';
import regex, { extractBetween } from '../../regex';
import { waitForElement } from '../helpers/wait';
import styles from '../../styles/staff-walkthrough-improvements';
import { template } from '../helpers/template';
import { allConcurrently } from '../components/promise';

const applyBody = async(): Promise<void> => {
  log.debug('Edit-Walkthrough', 'Starting - applyBody');

  await allConcurrently(2, [styles, applyImprovedImageSelector, applyTinymceThemeToggle]);

  log.debug('Edit-Walkthrough', 'Finished - applyBody');
};

const applyImprovedImageSelector = async(): Promise<void> => {
  if (!config.staffWalkthroughImprovements.improvedImageSelector) return;

  log.debug('Edit-Walkthrough', 'Starting - applyImprovedImageSelector');

  const html = fs.readFileSync('./src/views/staff-walkthrough-improvements.html', 'utf8');
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const stickyImageHeader = parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorContainerJs}`);
  const imageContainer = await waitForElement('#oWalkthroughImageViewer');
  imageContainer.classList.add(Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorStyle, Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs);
  
  const imageViewer = imageContainer.querySelector('.imageviewer');

  imageContainer.insertBefore(stickyImageHeader, imageViewer);
  stickyImageHeader.appendChild(imageViewer.querySelector('.itemname, .noimages'));
  stickyImageHeader.appendChild(imageViewer.querySelector('.addimages a'));

  ([...imageViewer.querySelectorAll('.ivimage a')] as HTMLElement[]).forEach(imageAnchor => {
    const clonedImageTitle = parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorImageTitleJs}`).cloneNode(true);
    const imageTitle = template(clonedImageTitle as HTMLElement, { image: imageAnchor.querySelector('img') });
    imageTitle.innerText = extractBetween("'", imageTitle.innerText);

    imageAnchor.appendChild(imageTitle);
  });

  log.debug('Edit-Walkthrough', 'Finished - applyImprovedImageSelector');
};

const applyTinymceThemeToggle = async(): Promise<void> => {
  log.debug('Edit-Walkthrough', 'Starting - applyTinymceThemeToggle');

  const html = fs.readFileSync('./src/views/staff-walkthrough-improvements.html', 'utf8');
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const themeToggle = parsedDocument.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`);
  const toolbar = await waitForElement('.mce-tinymce .mce-toolbar.mce-last .mce-container-body');

  if (!toolbar) {
    log.error('Edit-Walkthrough', 'Failed to find tinymce toolbar');
    return;
  }

  if (config.staffWalkthroughImprovements.tinymceTheme !== null) {
    themeToggle.setAttribute('data-ta-x-tinymce-theme', config.staffWalkthroughImprovements.tinymceTheme);
  }

  toolbar.appendChild(themeToggle);

  log.debug('Edit-Walkthrough', 'Finished - applyTinymceThemeToggle');
};

const listen = (): void => {
  log.debug('Edit-Walkthrough', 'Starting - listen');

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
    log.debug('Edit-Walkthrough', 'Starting improvedImageSelector - listen');

    window.addEventListener('blur', () => {
      if (document.activeElement === document.querySelector('#txtWalkthrough_ifr')) {
        const imageSelector = document.querySelector(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.improvedImageSelectorJs}`) as HTMLElement;

        if (imageSelector.style.display !== 'block') return;
  
        imageSelector.style.display = 'none';
      }
    });

    log.debug('Edit-Walkthrough', 'Finished improvedImageSelector - listen');
  }

  log.debug('Edit-Walkthrough', 'Finished - listen');
};

export default async(): Promise<void> => {
  if (!regex.test.staff.walkthrough.editWalkthroughUrl(window.location.href)) return;

  log.debug('Edit-Walkthrough', 'Starting');

  await applyBody();
  listen();

  log.debug('Edit-Walkthrough', 'Finished');
};
