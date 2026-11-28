import { classNames } from '@ta-x-lib';
import { saveSetting, type Setting } from '@ta-x-storage';
import { useLayoutEffect, useRef, useState } from 'preact/hooks';

import type { KeyboardEventHandler, MouseEventHandler } from 'preact';

import { ListSettingItem } from '../ListSettingItem';
import { settingId } from '../setting-id';
import styles from '../styles';

interface ListSettingProps {
  label: string;
  buttonText: string;
  // The setting (a list of strings) the list shows and saves
  setting: Setting<string[]>;
  // Extra classes on the row (settingRowClasses)
  containerClasses?: string;
}

// A settings menu list: a field, an add button and the values added, each with a Remove link. Saved to its setting on
// every change
export const ListSetting = ({ label, buttonText, setting, containerClasses }: ListSettingProps) => {
  // The list's id; the field is `${id}-input`
  const id = settingId(setting);
  const inputId = `${id}-input`;
  const values = setting.value;
  const setValues = (next: string[]): void => saveSetting(setting, next);
  const [text, setText] = useState('');
  const fieldRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  // The value just removed, so the focus can go to what's there now (it went with its Remove)
  const removedAtRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (removedAtRef.current === null) {
      return;
    }

    const removes = [...(listRef.current?.querySelectorAll<HTMLElement>('a[role="button"]') ?? [])];
    const next = removes[Math.min(removedAtRef.current, removes.length - 1)] ?? fieldRef.current;
    removedAtRef.current = null;
    next?.focus();
  }, [values]);

  // Adds what was typed, trimmed; a value already in the list isn't added twice
  const addText = (): void => {
    const value = text.trim();
    if (value === '') {
      return;
    }

    if (!values.includes(value)) {
      setValues([...values, value]);
    }
    setText('');
  };

  // The button is a submit inside the site's page form, so it must not submit it
  const add: MouseEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    addText();
  };

  // Enter adds, as the button does. Left alone it would submit the site's page form through its first submit button
  // (the settings menu's Add Keyword, whatever field it was typed in). Escape clears what was typed, used up (its
  // default prevented) so the settings menu doesn't close on it too; with the field empty, Escape is left to the menu
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addText();
    } else if (event.key === 'Escape' && text !== '') {
      event.preventDefault();
      setText('');
    }
  };

  return (
    <div class={classNames(styles.listbox, containerClasses)}>
      <label for={inputId}>{label}</label>

      <div class="frm-grp frm-lst">
        <input
          ref={fieldRef}
          type="text"
          id={inputId}
          name={inputId}
          class="textbox cs-n"
          value={text}
          onInput={(event) => setText(event.currentTarget.value)}
          onKeyDown={onKeyDown}
        />

        <input type="submit" value={buttonText} onClick={add} />

        <ul ref={listRef} class="item-list" id={id}>
          {values.map((value, index) => (
            <ListSettingItem
              // Values can repeat, so their place in the list is part of the key
              key={`${index}-${value}`}
              value={value}
              onRemove={() => {
                removedAtRef.current = index;
                setValues(values.filter((_, other) => other !== index));
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
