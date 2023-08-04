import { Constants, config } from '@ta-x-globals';
import { ConditionalRender, ListSetting } from '@ta-x-models';
import { pubSub } from '@ta-x-components';
import {
  waitForElement,
  getValue,
  isCheckboxElement,
  isSelectElement,
  setValue,
  toBool,
  isTAXChildListElement
} from '@ta-x-utilities';
import { template } from '@ta-x-helpers';
import html from './body.hbs';

// Elements -------
let extensionBody: HTMLElement;

const applyBody = async (): Promise<void> => {
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const navigationBar = await waitForElement('header nav');
  const navGamerToggle = await waitForElement('[data-tgl="nav-gamer"]', navigationBar);

  navigationBar.insertBefore(
    parsedDocument.querySelector(`.${Constants.Styles.SettingsMenu.wrenchJs}`),
    navGamerToggle.nextSibling
  );

  const navGamer = await waitForElement('.nav-gamer');
  const templatedFeature = template(parsedDocument.querySelector(`.${Constants.Styles.SettingsMenu.featureJs}`));
  navGamer.parentNode.insertBefore(templatedFeature, navGamer.nextSibling);

  addSettings();
};

const addSettings = (): void => {
  extensionBody = document.querySelector(`.${Constants.Styles.SettingsMenu.featureJs}`);

  ([...extensionBody.querySelectorAll('input, select')] as HTMLElement[]).forEach((setting) => {
    const configPath = setting.getAttribute('data-config-path');

    if (!configPath) return;
    if (isCheckboxElement(setting)) {
      (setting as HTMLInputElement).checked = getValue(config, configPath, false);
    } else if (isSelectElement(setting)) {
      if (toBool(setting.getAttribute('data-is-array'))) {
        (setting as HTMLSelectElement).value = getValue<string[]>(config, configPath, []).join(
          setting.getAttribute('data-array-split')
        );
      } else {
        (setting as HTMLSelectElement).value = getValue(config, configPath, '');
      }
    } else if (isTAXChildListElement(setting)) {
      const listElement = new ListSetting(setting);
      let values: string[];

      if (toBool(setting.getAttribute('data-is-array'))) {
        values = getValue<string[]>(config, configPath, []);
      } else {
        values = [getValue(config, configPath, '')];
      }

      values.forEach((value) => {
        listElement.list.appendChild(createListElement(listElement, value));
      });
    }
  });

  checkRenderConditions();
};

const checkRenderConditions = (el?: HTMLElement): void => {
  const querySelector = el ? `[data-render-condition*="#${el.id}"]` : '[data-render-condition]';

  ([...extensionBody.querySelectorAll(querySelector)] as HTMLElement[]).forEach((hiddenSetting) => {
    const condition = ConditionalRender.fromString(hiddenSetting.getAttribute('data-render-condition'));
    const method = condition?.test(extensionBody);

    if (method) {
      hiddenSetting.classList[method](Constants.Styles.Base.hide);
    }
  });
};

const setAccordionStates = (): void => {
  ([...extensionBody.querySelectorAll('[data-checkbox-accordion] input')] as HTMLElement[]).forEach((setting) => {
    if (isCheckboxElement(setting)) {
      const checkedValue = (setting as HTMLInputElement).checked;
      const accordionParent = setting.closest('.js-ta-x-accordion');

      if (checkedValue && accordionParent) {
        pubSub.publish('accordion:toggleState', accordionParent as HTMLElement);
      }
    }
  });
};

const createListElement = (listSetting: ListSetting, value: string): HTMLElement => {
  const templateListItem = listSetting.parent.querySelector(
    listSetting.parent.getAttribute('data-template-id')
  ) as HTMLTemplateElement;
  const templatedListItem = template(templateListItem.content.firstElementChild.cloneNode(true), {
    listSetting: {
      id: listSetting.listId,
      value: value
    }
  });

  return templatedListItem;
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
    if (!isTAXChildListElement(target)) return;

    const listElement = new ListSetting(target);
    const configPath = (listElement.parent.querySelector('[data-config-path]') as HTMLElement).getAttribute(
      'data-config-path'
    );

    if (target.hasAttribute('data-add')) {
      if (listElement.input.value === '') return;

      listElement.list.appendChild(createListElement(listElement, listElement.input.value));
      listElement.input.value = '';
    } else if (target.hasAttribute('data-remove')) {
      listElement.list.removeChild(target.closest('li'));
    }

    setValue(
      config,
      configPath,
      ([...listElement.list.querySelectorAll('[data-value]')] as HTMLElement[]).map((val: HTMLElement) =>
        val.getAttribute('data-value')
      )
    );

    let parentAccordionBody = target.closest('.ta-x-settings-menu-settings-accordion-body') as HTMLElement;
    if (parentAccordionBody) pubSub.publish('accordion:setMaxHeight', parentAccordionBody);

    setTimeout(() => {
      parentAccordionBody = target.closest('[data-parent-accordion-body]') as HTMLElement;
      if (parentAccordionBody) pubSub.publish('accordion:setMaxHeight', parentAccordionBody);
    }, 500);
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
    if (
      !target.classList.contains(Constants.Styles.SettingsMenu.versionLink) &&
      !target.classList.contains(Constants.Styles.SettingsMenu.documentationLink)
    )
      return;

    const changelogView = extensionBody.querySelector(`.${Constants.Styles.SettingsMenu.changelogView}`);
    const documentationView = extensionBody.querySelector(`.${Constants.Styles.SettingsMenu.featureDocumentationView}`);
    const settingsView = extensionBody.querySelector(`.${Constants.Styles.SettingsMenu.settingsView}`);
    const currentView = extensionBody.querySelector(`.${Constants.Styles.SettingsMenu.settingsContentShow}`);
    const nextView = target.classList.contains(Constants.Styles.SettingsMenu.versionLink)
      ? changelogView
      : documentationView;

    if (currentView === nextView) {
      nextView.classList.toggle(Constants.Styles.SettingsMenu.settingsContentShow);
      settingsView.classList.toggle(Constants.Styles.SettingsMenu.settingsContentShow);
    } else {
      currentView.classList.toggle(Constants.Styles.SettingsMenu.settingsContentShow);
      nextView.classList.toggle(Constants.Styles.SettingsMenu.settingsContentShow);
    }
  });

  extensionBody.addEventListener('change', ({ target }): void => {
    if (!(target instanceof HTMLElement)) return;
    const configPath = target.getAttribute('data-config-path');

    if (isSelectElement(target)) {
      if (toBool(target.getAttribute('data-is-array'))) {
        setValue(
          config,
          configPath,
          (target as HTMLSelectElement).value.split(target.getAttribute('data-array-split'))
        );
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
