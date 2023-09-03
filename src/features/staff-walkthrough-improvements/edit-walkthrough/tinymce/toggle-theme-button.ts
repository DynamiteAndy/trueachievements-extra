import skin from '@ta-x-tinymce-scss/charcoal/skin.scss';
import content from '@ta-x-tinymce-scss/charcoal/content.scss';
import { Constants, editWalkthrough } from '@ta-x-globals';
import { waitForElement } from '@ta-x-utilities';

let themeToggle: HTMLElement;
let globalTheme: HTMLElement;

const getTinymceTheme = async (): Promise<string> => {
  globalTheme = globalTheme ? globalTheme : ((await waitForElement('.page, [data-theme]')) as HTMLElement);

  if (editWalkthrough.tinymceTheme !== null) {
    return editWalkthrough.tinymceTheme;
  } else {
    return globalTheme ? globalTheme.getAttribute('data-theme') : '';
  }
};

const listen = async (): Promise<void> => {
  themeToggle.addEventListener('click', ({ target }) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const currentTheme = target.getAttribute('data-ta-x-tinymce-theme');
    const newTheme = currentTheme === 'dark' ? '' : 'dark';

    editWalkthrough.tinymceTheme = newTheme;
    target.setAttribute('data-ta-x-tinymce-theme', newTheme);
  });

  const iframe = (await waitForElement('#txtWalkthrough_ifr')) as HTMLIFrameElement;
  iframe.addEventListener('load', async () => {
    const iframeDocument = iframe && iframe.contentDocument;

    const bodyEl = (await waitForElement('#tinymce', iframeDocument)) as HTMLElement;
    bodyEl.classList.add(Constants.Styles.root, Constants.Styles.StaffWalkthroughImprovements.featureStyle);
    bodyEl.setAttribute('data-ta-x-tinymce-theme', await getTinymceTheme());

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
      if (mutation.type !== 'attributes') {
        return;
      }
      if (!(mutation.target instanceof HTMLElement)) {
        return;
      }

      let theme: string;
      if (mutation.attributeName === 'data-theme') {
        theme = mutation.target.getAttribute('data-theme');
        preventMutation = true;
        themeToggle.setAttribute('data-ta-x-tinymce-theme', theme === 'dark' ? theme : '');
        document.body.setAttribute('data-ta-x-theme', theme === 'dark' ? theme : '');
      } else if (mutation.attributeName === 'data-ta-x-tinymce-theme') {
        theme = mutation.target.getAttribute('data-ta-x-tinymce-theme');
      } else {
        return;
      }

      if (theme !== null && theme !== undefined) {
        iframe.contentWindow.postMessage({ theme: theme }, '*');
      }
    });
  });

  observer.observe(themeToggle, {
    attributes: true
  });

  observer.observe(globalTheme, {
    attributes: true
  });
};

export const addToggleThemeButton = async (toolbar: HTMLElement): Promise<void> => {
  GM_addStyle(skin);

  themeToggle = toolbar.querySelector(
    `.${Constants.Styles.StaffWalkthroughImprovements.EditWalkthroughPage.themeToggleJs} [data-ta-x-tinymce-theme]`
  );

  const theme = await getTinymceTheme();
  themeToggle.setAttribute('data-ta-x-tinymce-theme', theme);
  document.body.setAttribute('data-ta-x-theme', theme);
  await listen();
};

export default { addToggleThemeButton };
