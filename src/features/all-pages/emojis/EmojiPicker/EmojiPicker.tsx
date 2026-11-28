import { callAll } from '@ta-x-lib';
import { addClasses } from '@ta-x-page';
import { controllerButtons, controllerButtonSize, controllerButtonSrc, smileys, smileySrc } from '@ta-x-site';
import { hideClass, clickOnEnterOrSpace, Smile, TabBar, TabContent, useTabs } from '@ta-x-ui';
import { useLayoutEffect, useMemo } from 'preact/hooks';

import type { VNode } from 'preact';

import styles from '../styles';

export interface EmojiGroup {
  group: string;
  emojis: { char: string; name: string }[];
}

interface EmojiPickerProps {
  // The reply's textarea, which the picked emoji is inserted into
  textareaId: string;
  // The emoji.json groups, shown after the site's smileys and controller buttons
  groups: EmojiGroup[];
  // The site's smiley and controller button slots the picker stands in for: hidden while it's mounted
  siteButtons?: Element[];
}

// Opening the panel and inserting call the site's own DropdownButtonPanel_Toggle and InsertAtCursor, which our script
// can't reach, so (like the site's own smiley and controller buttons) they're inline handlers that run in the page.
// Set as attributes once rendered, since Preact turns an `onclick` prop into an event listener. An item takes Enter and
// Space too: its click (clickOnEnterOrSpace) runs the inline handler in the page as a mouse click does.
const inlineOnClick = (code: string) => (element: HTMLElement | null) => element?.setAttribute('onclick', code);

const getTabId = (group: string): string => group.replace(/[^A-Z0-9]/gi, '').toLowerCase();

export const EmojiPicker = ({ textareaId, groups, siteButtons = [] }: EmojiPickerProps) => {
  useLayoutEffect(() => {
    // Given back exactly: a button that had no class attribute gets none back, not an empty one
    const giveBack = siteButtons.map((button) => addClasses(button, hideClass));

    return () => callAll(giveBack);
  }, [siteButtons]);

  const tabs = useTabs('trueachievements');
  const tabBar = useMemo(
    () => [
      { id: 'trueachievements', label: 'TrueAchievements' },
      { id: 'controller', label: 'Controller' },
      ...groups.map(({ group }) => ({ id: getTabId(group), label: group }))
    ],
    [groups]
  );
  const panel = (id: string) => ({ id, tabGroupId: tabs.tabGroupId, visible: tabs.selected === id });

  // Each panel's items, built once (on first open for the emoji groups), so switching tabs only re-renders the tabs and
  // which panel shows; Preact skips vnodes it has already rendered
  const items = useMemo(() => {
    const insert = (code: string) =>
      inlineOnClick(`InsertAtCursor('${textareaId}','${code}', '${styles.jsEmojiDropdown}'); return false;`);
    const built = new Map<number, VNode[]>();

    return {
      smileys: smileys.map(({ name, width, height }) => (
        <span key={name} ref={insert(`[${name}]`)} tabIndex={0} role="button" onKeyDown={clickOnEnterOrSpace}>
          <img src={smileySrc(name)} alt={name} width={width} height={height} />
        </span>
      )),
      controllerButtons: controllerButtons.map((name) => (
        <span key={name} ref={insert(`[${name}]`)} tabIndex={0} role="button" onKeyDown={clickOnEnterOrSpace}>
          <img src={controllerButtonSrc(name)} alt={name} width={controllerButtonSize} height={controllerButtonSize} />
        </span>
      )),
      group: (index: number): VNode[] => {
        if (!built.has(index)) {
          built.set(
            index,
            groups[index].emojis.map(({ char, name }) => (
              <span
                key={name}
                ref={insert(char)}
                title={name}
                tabIndex={0}
                role="button"
                aria-label={name}
                onKeyDown={clickOnEnterOrSpace}
              >
                {char}
              </span>
            ))
          );
        }

        return built.get(index) ?? [];
      }
    };
  }, [textareaId, groups]);

  return (
    <div class={`${styles.jsEmojis} ${styles.emojis}`}>
      <a title="Insert TaX Emoji" href="#" ref={inlineOnClick('DropdownButtonPanel_Toggle(this); return false;')}>
        <Smile />
      </a>
      <div class={`smileydropdown dropdownbuttonpanel ${styles.jsEmojiDropdown}`} style={{ display: 'none' }}>
        <TabBar tabs={tabBar} selected={tabs.selected} onSelect={tabs.select} tabGroupId={tabs.tabGroupId} />
        <TabContent {...panel('trueachievements')}>{items.smileys}</TabContent>
        <TabContent {...panel('controller')}>{items.controllerButtons}</TabContent>
        {groups.map(({ group }, index) => (
          // Built when the tab is first opened: most people never open the emoji tabs, and their items are many
          <TabContent key={group} {...panel(getTabId(group))} lazy>
            {() => items.group(index)}
          </TabContent>
        ))}
      </div>
    </div>
  );
};
