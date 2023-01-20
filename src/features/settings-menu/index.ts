import { Constants, config } from '@ta-x-globals';
import { ConditionalRender } from '@ta-x-models';
import { pubSub } from '@ta-x-components';
import { waitForElement, getValue, isCheckboxElement, isSelectElement, setValue, toBool } from '@ta-x-utilities';
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
    if (isCheckboxElement(setting)) {
      (setting as HTMLInputElement).checked = getValue(config, configPath, false);
    } else if (isSelectElement(setting)) {
      if (toBool(setting.getAttribute('data-is-array'))) {
        (setting as HTMLSelectElement).value = getValue<string[]>(config, configPath, []).join(setting.getAttribute('data-array-split'));
      } else {
        (setting as HTMLSelectElement).value = getValue(config, configPath, '');
      }
    }
  });

  checkRenderConditions();
};

const checkRenderConditions = (el?: HTMLElement): void => {
  const querySelector = el ? `[data-render-condition*="#${el.id}"]` : '[data-render-condition]';

  ([...extensionBody.querySelectorAll(querySelector)] as HTMLElement[]).forEach(hiddenSetting => {
    const condition = new ConditionalRender(hiddenSetting.getAttribute('data-render-condition'));

    if (!condition.isValid()) return;

    const setting = extensionBody.querySelector(condition.selector) as HTMLElement;
    let method: string = null;

    if (isCheckboxElement(setting)) {
      method = (setting as HTMLInputElement).checked === condition.checked ? 'remove' : 'add';
    } else if (isSelectElement(setting)) {
      if (toBool(setting.getAttribute('data-is-array'))) {
        method = condition.value.some(val => (setting as HTMLSelectElement).value.split(setting.getAttribute('data-array-split')).includes(val)) ? 'remove' : 'add';
      } else {
        method = condition.value.includes((setting as HTMLSelectElement).value) ? 'remove' : 'add';
      }
    }

    if (method) {
      hiddenSetting.classList[method](Constants.Styles.Base.hide);
    }
  });
};

const setAccordionStates = (): void => {
  ([...extensionBody.querySelectorAll('[data-checkbox-accordion] input')] as HTMLElement[]).forEach(setting => {
    if (isCheckboxElement(setting)) {
      const checkedValue = (setting as HTMLInputElement).checked;
      const accordionParent = setting.closest('.js-ta-x-accordion');

      if (checkedValue && accordionParent) {
        pubSub.publish('accordion:toggleState', accordionParent as HTMLElement);
      }
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

    if (extensionBody.hasAttribute('data-previously-opened')) return;

    extensionBody.setAttribute('data-previously-opened', '');
    setAccordionStates();
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

    if (isSelectElement(target)) {
      if (toBool(target.getAttribute('data-is-array'))) {
        setValue(config, configPath, (target as HTMLSelectElement).value.split(target.getAttribute('data-array-split')));
      } else {
        setValue(config, configPath, (target as HTMLSelectElement).value);
      }
    } else if (isCheckboxElement(target)) setValue(config, configPath, (target as HTMLInputElement).checked);

    checkRenderConditions(target);
    
    let parentAccordionBody = target.closest('.ta-x-settings-menu-settings-accordion-body') as HTMLElement;
    if (parentAccordionBody) pubSub.publish('accordion:setMaxHeight', parentAccordionBody);

    setTimeout(() => {
      parentAccordionBody = target.closest('[data-parent-accordion-body]') as HTMLElement;
      if (parentAccordionBody) pubSub.publish('accordion:setMaxHeight', parentAccordionBody);
    }, 500);
  });
};

export default async (): Promise<void> => {
  await applyBody();
  listen();
};
