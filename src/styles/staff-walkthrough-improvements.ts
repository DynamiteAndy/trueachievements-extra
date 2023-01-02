import skin from '@ta-x-tinymce-scss/charcoal/skin.scss';
import content from '@ta-x-tinymce-scss/charcoal/content.scss';
import { Constants } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';
import config from '../config';

const listen = async(): Promise<void> => {
  const iframe =  await waitForElement('#txtWalkthrough_ifr') as HTMLIFrameElement;
  const globalThemeElement = await waitForElement('[data-theme]') as HTMLElement;
  const tinymceThemeElement = await waitForElement(`.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs}`);
  let theme: string;

  if (config.staffWalkthroughImprovements.tinymceTheme === null) {
    theme = globalThemeElement.getAttribute('data-theme');
  } else {
    theme = config.staffWalkthroughImprovements.tinymceTheme;
  }
  
  iframe.addEventListener('load', async() => {
    const iframeDocument = iframe && iframe.contentDocument;

    const bodyEl = await waitForElement('#tinymce', iframeDocument) as HTMLElement;
    bodyEl.classList.add(Constants.Styles.root, Constants.Styles.StaffWalkthroughImprovements.featureStyle);
    bodyEl.setAttribute('data-ta-x-tinymce-theme', theme);

    const style = iframeDocument.createElement('style');
    style.id = 'ta-x-staff-walkthrough-improvements-dark-tinymce-style';
    style.innerHTML = content;
    iframeDocument.head.appendChild(style);

    const script = iframeDocument.createElement('script');
    script.id = 'ta-x-staff-walkthrough-improvements-dark-tinymce-script';
    script.innerHTML = `window.addEventListener('message', function(event) {
      console.log(event);
      if (!event || !event.data || event.data.theme === null || event.data.theme === undefined) return;
      document.body.setAttribute('data-ta-x-tinymce-theme', event.data.theme);
    });`;
    iframeDocument.head.appendChild(script);

    iframe.removeEventListener('load', this);
  });

  let preventMutation = false;
  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    if (preventMutation) {
      preventMutation = false;
      return;
    }

    mutations.forEach((mutation: MutationRecord) => {
      if (mutation.type === 'attributes') {
        let theme: string;
        if (mutation.attributeName === 'data-theme') {
          theme = (mutation.target as HTMLElement).getAttribute('data-theme');
          preventMutation = true;
          tinymceThemeElement.setAttribute('data-ta-x-tinymce-theme', theme === 'dark' ? theme : '');
        } else if (mutation.attributeName === 'data-ta-x-tinymce-theme') {
          theme = (mutation.target as HTMLElement).getAttribute('data-ta-x-tinymce-theme');
        } else {
          return;
        }

        if (theme !== null && theme !== undefined) {
          iframe.contentWindow.postMessage({ theme: theme }, '*');
        }
      }
    });
  });
  
  observer.observe(globalThemeElement, {
    attributes: true
  });

  observer.observe(tinymceThemeElement, {
    attributes: true
  });
};

export default  async (): Promise<void> => {
  if (!await waitForElement('[href*="skin.min.css"]', document.head)) return;
  
  GM_addStyle(skin);
  await listen();
};
