import { TinyMCEScript } from '@ta-x-models';
import { waitForElement } from '@ta-x-utilities';
import { Constants, editWalkthrough } from '@ta-x-globals';
import sunSVG from '@ta-x-svgs/sun.hbs';
import moonSVG from '@ta-x-svgs/moon.hbs';
import skin from '@ta-x-tinymce-scss/charcoal/skin.scss';
import content from '@ta-x-tinymce-scss/charcoal/content.scss';
import styles from '../styles';
import attributes from '../attributes';
import staffWalkthroughImprovementsStyles from '../../styles';

class ToggleThemeScript extends TinyMCEScript {
  private globalTheme: HTMLElement;
  private themeToggle: HTMLElement;

  constructor() {
    super('ta-x-staff-walkthrough-improvements-add-toggle-theme-command');
  }

  private getTinymceTheme = async (): Promise<string> => {
    this.globalTheme = this.globalTheme
      ? this.globalTheme
      : ((await waitForElement('.page, [data-theme]')) as HTMLElement);

    if (editWalkthrough.tinymceTheme !== null) {
      return editWalkthrough.tinymceTheme;
    }
    
    return this.globalTheme ? this.globalTheme.getAttribute('data-theme') : '';
  };

  private listen = async (): Promise<void> => {
    const iframe = (await waitForElement('#txtWalkthrough_ifr')) as HTMLIFrameElement;
    const iframeLoadHandler = async () => {
      const iframeDocument = iframe?.contentDocument;

      const bodyEl = (await waitForElement('#tinymce', iframeDocument)) as HTMLElement;
      bodyEl.classList.add(Constants.Styles.root, staffWalkthroughImprovementsStyles.staffWalkthroughImprovements);
      bodyEl.setAttribute(attributes.tinymceTheme, await this.getTinymceTheme());

      const style = iframeDocument.createElement('style');
      style.id = 'ta-x-staff-walkthrough-improvements-dark-tinymce-style';
      style.innerHTML = content;
      iframeDocument.head.appendChild(style);

      const script = iframeDocument.createElement('script');
      script.id = 'ta-x-staff-walkthrough-improvements-dark-tinymce-script';
      script.innerHTML = `window.addEventListener('message', function(event) {
        console.debug(event);
        if (!event || !event.data || event.data.theme === null || event.data.theme === undefined) return;
        document.body.setAttribute('${attributes.tinymceTheme}', event.data.theme);
      });`;
      iframeDocument.head.appendChild(script);
      iframe.removeEventListener('load', iframeLoadHandler);
    };

    iframe.addEventListener('load', iframeLoadHandler);
  };

  private observe = async (): Promise<void> => {
    const iframe = (await waitForElement('#txtWalkthrough_ifr')) as HTMLIFrameElement;
    this.themeToggle = document.querySelector(`[aria-label="Toggle Theme"] [${attributes.tinymceTheme}]`);

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
          this.themeToggle.setAttribute(attributes.tinymceTheme, theme === 'dark' ? theme : '');
          document.body.setAttribute(attributes.theme, theme === 'dark' ? theme : '');
        } else if (mutation.attributeName === attributes.tinymceTheme) {
          theme = mutation.target.getAttribute(attributes.tinymceTheme);
        } else {
          return;
        }

        if (theme !== null && theme !== undefined) {
          editWalkthrough.tinymceTheme = theme;
          iframe.contentWindow.postMessage({ theme: theme }, '*');
        }
      });
    });

    observer.observe(this.themeToggle, {
      attributes: true
    });

    observer.observe(this.globalTheme, {
      attributes: true
    });
  };

  buildScript = async (): Promise<HTMLScriptElement> => {
    const theme = await this.getTinymceTheme();
    document.body.setAttribute(attributes.theme, theme);

    const script = `
      ((editor, theme) => {
        console.debug('Adding Toggle Theme Button');

        editor.addButton('toggleTheme', {
          tooltip: 'Toggle Theme',
          onclick: function (e) {
            var target = e.target;
            var currentTheme = target.getAttribute('${attributes.tinymceTheme}');
            var newTheme = currentTheme === 'dark' ? '' : 'dark';

            target.setAttribute('${attributes.tinymceTheme}', newTheme);
          }
        });

        var toggleThemeButton = editor.buttons['toggleTheme'];
        var taxGroup = editor.theme.panel.find('toolbar > buttongroup').filter(function(bg) {
          return bg.settings.name === '${styles.taxGroupName}';
        })[0];

        taxGroup._lastRepaintRect = taxGroup._layoutRect;
        taxGroup.append(toggleThemeButton);

        function createElementFromHTML(htmlString) {
          var div = document.createElement('div');
          div.innerHTML = htmlString.trim();

          // Change this to div.childNodes to support multiple top-level nodes.
          return div.firstChild;
        };

        var button = document.querySelector('[aria-label="Toggle Theme"] button');
        button.setAttribute('${attributes.tinymceTheme}', theme);
        button.classList.add('${styles.themeToggleJs}', '${styles.themeToggle}');

        var sun = createElementFromHTML('${sunSVG}');
        sun.classList.add('${styles.themeToggleLight}');
        button.innerHTML = sun.outerHTML

        var moon = createElementFromHTML('${moonSVG}');
        moon.classList.add('${styles.themeToggleDark}');
        button.innerHTML += moon.outerHTML

        console.debug('Added Toggle Theme Button');
      })(tinymce.activeEditor, '${theme}');
    `;

    return this.createScript(script);
  };

  injectScript = async (): Promise<void> => {
    GM_addStyle(skin);

    await this.listen();
    await waitForElement(`.mce-${styles.tinymceGroup}`);
    document.body.appendChild(await this.buildScript());
    await this.observe();
  };
}

export const addToggleThemeButton = new ToggleThemeScript().injectScript;
