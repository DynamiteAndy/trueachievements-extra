import { classNames } from '@ta-x-lib';
import changelog from '@ta-x-project-root/CHANGELOG.md?latest';
import credits from '@ta-x-project-root/CREDITS.md?sections';
import featureDocumentation from '@ta-x-project-root/FEATURE-DOCUMENTATION.md?sections';
import { bugs } from '@ta-x-project-root/package.json';
import { Accordion, clickOnEnterOrSpace, Close, hideClass, noJump, TabBar, TabContent, useTabs } from '@ta-x-ui';
import { useEffect, useRef } from 'preact/hooks';

import type { ComponentType } from 'preact';

import { closeSettingsMenu, settingsMenuOpen } from '../settings-menu-open';
import styles from '../styles';

// A new issue on the project, from one of its templates (.github/ISSUE_TEMPLATE)
const newIssueUrl = (template: string): string => `${bugs.url}/new?template=${template}`;

// A feature group's tab: its id, its label in the tab bar and its settings panel
export interface SettingsTab {
  id: string;
  label: string;
  Settings: ComponentType;
}

const CHANGELOG = 'changelog-credits';
const DOCUMENTATION = 'feature-documentation';

interface SettingsMenuProps {
  version: string;
  // In the order they show; the first is selected until another is chosen
  settingsTabs: SettingsTab[];
}

// Build-time HTML from the project's own markdown (build/loaders/markdown-loader.ts)
const Markdown = ({ html, class: classes }: { html: string; class: string }) => (
  <div class={classes} dangerouslySetInnerHTML={{ __html: html }} />
);

// What Tab can reach in the menu: its links and controls, the close, and any other element given a tab stop (hidden
// tabs and collapsed groups left out, as Tab skips them: a collapsed group's content is inert, which checkVisibility
// doesn't see)
const tabbable = (menu: HTMLElement): HTMLElement[] =>
  [
    ...menu.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex]'
    )
  ].filter((element) => element.tabIndex >= 0 && element.checkVisibility() && !element.closest('[inert]'));

// While the menu is open, Escape closes it and Tab goes round its controls rather than on to the page behind it. An
// Escape a control used itself (its default prevented: a list setting clearing its field) doesn't close it
const onKeyWhileOpen = (menu: HTMLElement, event: KeyboardEvent): void => {
  if (event.key === 'Escape' && !event.defaultPrevented) {
    event.preventDefault();
    closeSettingsMenu();
    return;
  }
  if (event.key !== 'Tab') {
    return;
  }

  const controls = tabbable(menu);
  const first = controls.at(0);
  const last = controls.at(-1);
  const focused = document.activeElement;
  const outside = focused === menu || !menu.contains(focused);
  const next = event.shiftKey ? (outside || focused === first) && last : (outside || focused === last) && first;
  if (next) {
    event.preventDefault();
    next.focus();
  }
};

// The settings menu: a tab per feature, the changelog and credits, the feature documentation and the footer links. Its
// settings are signals (storage/settings-tree.ts): each row shows and saves its own, and a change elsewhere (another
// tab) shows at once. The version and documentation links show their view (a panel with no tab) in place of the current
// tab, or go back to it
export const SettingsMenu = ({ version, settingsTabs }: SettingsMenuProps) => {
  // Whether it's open: shared with the wrench, which is mounted elsewhere (settings-menu-open.ts)
  const open = settingsMenuOpen.value;
  const tabs = useTabs(settingsTabs[0].id);
  const dialog = useRef<HTMLDivElement>(null);
  // A tab or view shows only while the menu is open, and each is built the first time it shows (lazy): the menu is on
  // every page, but most visits never open it
  const shows = (id: string): boolean => open && tabs.selected === id;

  // Open, focus moves into the menu (the dialog itself, so a screen reader reads its name) and its keys are listened
  // for; closed, focus goes back to the wrench. Neither scrolls the page: the menu covers the page from its top
  useEffect(() => {
    const menu = dialog.current;
    if (!open || !menu) {
      return;
    }

    menu.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent): void => onKeyWhileOpen(menu, event);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.querySelector<HTMLElement>(`.${styles.jsWrench}`)?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <div
      ref={dialog}
      class={classNames(styles.jsFeature, styles.menu, open ? 'nav-gamer open' : hideClass)}
      role="dialog"
      aria-modal="true"
      aria-label="TrueAchievements Extra Settings"
      tabIndex={-1}
    >
      <div class="middle">
        <div class="wrap">
          <div class="labels">
            <TabBar tabs={settingsTabs} selected={tabs.selected} onSelect={tabs.select} class="tabs-nav" />

            {/* A label as the site's panel styles its labels bar's (.labels label). A label can't be a button, so the
                keyboard button is the icon's wrapper inside it, an inline span adding no box of its own; a click on
                either closes */}
            <label class="close" onClick={closeSettingsMenu}>
              <span role="button" tabIndex={0} aria-label="Close Settings" onKeyDown={clickOnEnterOrSpace}>
                <Close />
              </span>
            </label>
          </div>

          <div class="contents">
            {settingsTabs.map(({ id, Settings }) => (
              <TabContent key={id} id={id} visible={shows(id)} lazy class="t-settings">
                <Settings />
              </TabContent>
            ))}

            <TabContent id={CHANGELOG} visible={shows(CHANGELOG)} lazy class="t-settings" label="Changelog and credits">
              <Markdown html={changelog} class={styles.changelogWrapper} />
              <Markdown html={credits.intro} class={styles.creditsWrapper} />
              {/* The libraries the addon is built with, closed until opened */}
              {credits.sections.map(({ title, html }) => (
                <Accordion key={title} title={title}>
                  <Markdown html={html} class={styles.creditsWrapper} />
                </Accordion>
              ))}
            </TabContent>

            <TabContent
              id={DOCUMENTATION}
              visible={shows(DOCUMENTATION)}
              lazy
              class="t-settings"
              label="Feature documentation"
            >
              <Markdown html={featureDocumentation.intro} class={styles.documentationWrapper} />
              {/* A section per settings tab, in the menu's order, each closed until opened */}
              {featureDocumentation.sections.map(({ title, html }) => (
                <Accordion key={title} title={title}>
                  <Markdown html={html} class={styles.documentationWrapper} />
                </Accordion>
              ))}
            </TabContent>

            <div class={classNames('t-settings open', styles.footer)}>
              <ul class="list-links buttons">
                <li>
                  <a href={newIssueUrl('bug_report.md')} target="_blank" rel="noopener noreferrer">
                    Raise a Bug
                  </a>
                </li>
                <li>
                  <a href={newIssueUrl('feature_request.md')} target="_blank" rel="noopener noreferrer">
                    Request a Feature
                  </a>
                </li>
              </ul>

              <div class="title">
                <span>TrueAchievements Extra</span>
                <div class="ta-x-flex-break"></div>
                <a
                  href="#"
                  role="button"
                  onClick={noJump(() => tabs.toggleView(CHANGELOG))}
                  onKeyDown={clickOnEnterOrSpace}
                >
                  Version {version}
                </a>
                <span>|</span>
                <a
                  href="#"
                  role="button"
                  onClick={noJump(() => tabs.toggleView(DOCUMENTATION))}
                  onKeyDown={clickOnEnterOrSpace}
                >
                  Feature Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="close" aria-hidden="true" onClick={closeSettingsMenu}></div>
    </div>
  );
};
