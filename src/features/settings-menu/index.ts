import { Constants, config } from '@ta-x-globals';
import { ConditionalRender, ListSetting } from '@ta-x-models';
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
import styles from './styles';
import attributes from './attributes';

// Elements -------
let extensionBody: HTMLElement;

const applyBody = async (): Promise<void> => {
  const parsedDocument = new DOMParser().parseFromString(html, 'text/html');
  const navigationBar = await waitForElement('header nav');
  const navGamerToggle = await waitForElement('[data-tgl="nav-gamer"]', navigationBar);

  navigationBar.insertBefore(
    parsedDocument.querySelector(`.${styles.jsWrench}`),
    navGamerToggle.nextSibling
  );

  const navGamer = await waitForElement('.nav-gamer');
  const templatedFeature = template(parsedDocument.querySelector(`.${styles.jsFeature}`));
  navGamer.parentNode.insertBefore(templatedFeature, navGamer.nextSibling);

  addSettings();
};

const addSettings = (): void => {
  extensionBody = document.querySelector(`.${styles.jsFeature}`);

  ([...extensionBody.querySelectorAll('input, select')] as HTMLElement[]).forEach((setting) => {
    const configPath = setting.getAttribute('data-config-path');

    if (!configPath) {
      return;
    }
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
  const extensionTrigger = document.querySelector(`.${styles.jsWrench}`);

  extensionTrigger.addEventListener('click', (): void => {
    extensionTrigger.classList.add('active');
    extensionBody.classList.add('nav-gamer');
    extensionBody.classList.remove(Constants.Styles.Base.hide);
    extensionBody.classList.add('open');
  });

  extensionBody.addEventListener('click', ({ target }): void => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (!isTAXChildListElement(target)) {
      return;
    }

    const listElement = new ListSetting(target);
    const configPath = (listElement.parent.querySelector('[data-config-path]') as HTMLElement).getAttribute(
      'data-config-path'
    );

    if (target.hasAttribute('data-add')) {
      if (listElement.input.value === '') {
        return;
      }

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
  });

  extensionBody.addEventListener('click', ({ target }): void => {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (!target.classList.contains(styles.jsClose)) {
      return;
    }

    extensionBody.classList.remove('open');
    extensionBody.classList.add(Constants.Styles.Base.hide);
    extensionBody.classList.remove('nav-gamer');
    extensionTrigger.classList.remove('active');
  });

  extensionBody.addEventListener('click', (ev: MouseEvent): void => {
    const target = ev.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (
      !target.classList.contains(styles.jsVersionLink) &&
      !target.classList.contains(styles.jsDocumentationLink) &&
      !target.classList.contains(styles.jsTabsLink)
    ) {
      return;
    }

    ev.preventDefault();

    const changelogView = extensionBody.querySelector(`.${styles.jsChangelogView}`);
    const documentationView = extensionBody.querySelector(`.${styles.jsFeatureDocumentationView}`);
    const settingsView = extensionBody.querySelector(`[${attributes.previousVisibleTab}], [${attributes.visibleTab}]`);
    const currentView = extensionBody.querySelector(`[${attributes.visibleTab}]`);
    const nextView = target.classList.contains(styles.jsVersionLink)
      ? changelogView
      : documentationView;

    if (target.classList.contains(styles.jsTabsLink)) {
      if (!settingsView.hasAttribute(attributes.previousVisibleTab)) {
        return;
      }

      currentView.removeAttribute(attributes.visibleTab);
      settingsView.removeAttribute(attributes.previousVisibleTab);
      settingsView.setAttribute(attributes.visibleTab, '');
      extensionBody.querySelector(`[${attributes.tabId}="#${settingsView.id}"]`).classList.add(styles.tabSelected);
    } else if (currentView === nextView) {
      nextView.removeAttribute(attributes.visibleTab);
      settingsView.removeAttribute(attributes.previousVisibleTab);
      settingsView.setAttribute(attributes.visibleTab, '');
      extensionBody.querySelector(`[${attributes.tabId}="#${settingsView.id}"]`).classList.add(styles.tabSelected);
    } else {
      if (!settingsView.hasAttribute(attributes.previousVisibleTab)) {
        settingsView.setAttribute(attributes.previousVisibleTab, '');
        extensionBody.querySelector(`[${attributes.tabId}="#${settingsView.id}"]`).classList.remove(styles.tabSelected);
      }

      currentView.removeAttribute(attributes.visibleTab);
      nextView.setAttribute(attributes.visibleTab, '');
    }
  });

  extensionBody.addEventListener('change', ({ target }): void => {
    if (!(target instanceof HTMLElement)) {
      return;
    }
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
    } else if (isCheckboxElement(target)) {
      setValue(config, configPath, (target as HTMLInputElement).checked);
    }

    checkRenderConditions(target);
  });
};

export default async (): Promise<void> => {
  await applyBody();
  listen();
};
