import { Constants, config } from '@ta-x-globals';
import { ConditionalRender } from '@ta-x-models';
import { waitForElement, getValue, isCheckboxElement, isSelectElement, setValue } from '@ta-x-utilities';
import { template } from '@ta-x-helpers';
import html from './body.hbs';

// Elements -------
let extensionBody: HTMLElement;

const applyBody = async(): Promise<void> => {
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const navigationBar = await waitForElement('header nav');
  const navGamerToggle = await waitForElement('[data-tgl="nav-gamer"]', navigationBar);

  navigationBar.insertBefore(parsedDocument.querySelector(`.${Constants.Styles.SettingsMenu.wrenchJs}`),
    navGamerToggle.nextSibling);

  const navGamer = await waitForElement('.nav-gamer');
  const templatedFeature = template(parsedDocument.querySelector(`.${Constants.Styles.SettingsMenu.featureJs}`));
  navGamer.parentNode.insertBefore(templatedFeature, navGamer.nextSibling);

  addSettings();
};

const addSettings = (): void => {
  extensionBody = document.querySelector(`.${Constants.Styles.SettingsMenu.featureJs}`);

  ([...extensionBody.querySelectorAll('input, select')] as HTMLElement[]).forEach(setting => {
    const configPath = setting.getAttribute('data-config-path');

    if (!configPath) return;
    if (isCheckboxElement(setting)) (setting as HTMLInputElement).checked = getValue(config, configPath, false);
    else if (isSelectElement(setting)) (setting as HTMLSelectElement).value = getValue(config, configPath, '');
  });

  checkRenderConditions();
};

const checkRenderConditions = (el?: HTMLElement): void => {
  const querySelector = el ? `[data-render-condition*="#${el.id}"]` : '[data-render-condition]';

  ([...extensionBody.querySelectorAll(querySelector)] as HTMLElement[]).forEach(hiddenSetting => {
    const condition = new ConditionalRender(hiddenSetting.getAttribute('data-render-condition'));

    if (!condition.isValid()) return;

    const settingInput = (el ? el : extensionBody.querySelector(condition.selector)) as HTMLInputElement;

    if (isCheckboxElement(settingInput)) {
      const method = settingInput.checked === condition.value ? 'remove' : 'add';
      
      hiddenSetting.classList[method](Constants.Styles.Base.hide);
    }
  });
};

const listen = (): void => {
  const extensionTrigger = document.querySelector(`.${Constants.Styles.SettingsMenu.wrenchJs}`);

  extensionTrigger.addEventListener('click', (): void => {
    extensionTrigger.classList.add('active');
    extensionBody.classList.add('nav-gamer');
    extensionBody.classList.remove(Constants.Styles.Base.hide);
    extensionBody.classList.add('open');
  });

  extensionBody.addEventListener('click', ({ target }): void => {
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains(Constants.Styles.SettingsMenu.closeJs)) return;

    extensionBody.classList.remove('open');
    extensionBody.classList.add(Constants.Styles.Base.hide);
    extensionBody.classList.remove('nav-gamer');
    extensionTrigger.classList.remove('active');
  });

  extensionBody.addEventListener('click', ({ target }): void => {
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains(Constants.Styles.SettingsMenu.versionLink)) return;

    extensionBody.querySelector(`.${Constants.Styles.SettingsMenu.changelogView}`)
    .classList.toggle(Constants.Styles.SettingsMenu.settingsContentShow);
    
    extensionBody.querySelector(`.${Constants.Styles.SettingsMenu.settingsView}`)
    .classList.toggle(Constants.Styles.SettingsMenu.settingsContentShow);
  });

  extensionBody.addEventListener('change', ({ target }): void => {
    if (!(target instanceof HTMLElement)) return;
    const configPath = target.getAttribute('data-config-path');

    if (isSelectElement(target)) setValue(config, configPath, (target as HTMLSelectElement).value);
    else if (isCheckboxElement(target)) setValue(config, configPath, (target as HTMLInputElement).checked);

    checkRenderConditions(target);
  });
};

export default async (): Promise<void> => {
  await applyBody();
  listen();
};
