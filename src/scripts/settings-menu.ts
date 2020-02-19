import * as fs from 'fs';
import config from '../config';
import { Constants } from '../constants';
import { template } from './helpers/template';
import { waitForElement } from './helpers/wait';
import ConditionalRender from './models/conditional-render';

// Elements -------
let extensionBody: HTMLElement;
let extensionTrigger: HTMLElement;

const applyBody = async(): Promise<void> => {
  const html = fs.readFileSync('./src/views/settings-menu.html', 'utf8');
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const navigationBar = await waitForElement('header nav');
  const navGamerToggle = await waitForElement('[data-tgl="nav-gamer"]', navigationBar);

  navigationBar.insertBefore(parsedDocument.querySelector(`.${Constants.Styles.SettingsMenu.wrenchJs}`),
    navGamerToggle.nextSibling);

  extensionTrigger = document.querySelector(`.${Constants.Styles.SettingsMenu.wrenchJs}`);

  const navGamer = await waitForElement('.nav-gamer');
  const templatedFeature = template(parsedDocument.querySelector(`.${Constants.Styles.SettingsMenu.featureJs}`))
  navGamer.parentNode.insertBefore(templatedFeature, navGamer.nextSibling);

  extensionBody = document.querySelector(`.${Constants.Styles.SettingsMenu.featureJs}`);

  [...extensionBody.querySelectorAll('input')].forEach(setting => {
    const configObject = setting.dataset.configArea;
    const configSettings = setting.dataset.configSetting;

    if (!configObject || !configSettings) return;
    if (setting.type === 'checkbox') setting.checked = config[configObject][configSettings];
  });

  ([...extensionBody.querySelectorAll('[data-render-condition]')] as HTMLElement[]).forEach(hiddenSetting => {
    const condition = new ConditionalRender(hiddenSetting.dataset.renderCondition);

    if (!condition.isValid()) return;

    const settingInput = document.querySelector(condition.selector) as HTMLInputElement;

    if (settingInput.type === 'checkbox') {
      hiddenSetting.classList[(settingInput.checked === condition.value)
        ? 'remove'
        : 'add'](Constants.Styles.Base.hide);
    }
  });
};

const listen = (): void => {
  extensionTrigger.addEventListener('click', () => {
    extensionTrigger.classList.add('active');
    extensionBody.classList.add('nav-gamer');
    extensionBody.classList.remove(Constants.Styles.Base.hide);
    extensionBody.classList.add('open');
  });

  extensionBody.addEventListener('click', ({ target }) => {
    if (!(target as HTMLElement)?.classList.contains(Constants.Styles.SettingsMenu.closeJs)) return;

    extensionBody.classList.remove('open');
    extensionBody.classList.add(Constants.Styles.Base.hide);
    extensionBody.classList.remove('nav-gamer');
    extensionTrigger.classList.remove('active');
  });

  extensionBody.addEventListener('change', ({ target }) => {
    const htmlTarget = target as HTMLElement;
    const inputTarget = target as HTMLInputElement;
    const configObject = htmlTarget?.dataset.configArea;
    const configSettings = htmlTarget?.dataset.configSetting;

    if (inputTarget?.type === 'checkbox') config[configObject][configSettings] = inputTarget?.checked;

    ([...extensionBody.querySelectorAll(`[data-render-condition*="#${htmlTarget.id}"]`)] as HTMLElement[]).forEach(hiddenSetting => {
      const condition = new ConditionalRender(hiddenSetting.dataset.renderCondition);

      if (!condition.isValid()) return;

      const inputTarget = target as HTMLInputElement;

      if (inputTarget.type === 'checkbox') {
        hiddenSetting.classList[(inputTarget.checked === condition.value)
          ? 'remove'
          : 'add'](Constants.Styles.Base.hide);
      }
    });
  });
};

export const render = async (): Promise<void> => {
  await applyBody();
  listen();
};
