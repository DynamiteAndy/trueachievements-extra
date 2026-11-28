import { classNames } from '@ta-x-lib';
import { useLayoutEffect, useRef } from 'preact/hooks';

import type { ComponentChildren, KeyboardEventHandler, MouseEventHandler } from 'preact';

import { hideClass } from '../../constants';
import { useUniqueId } from '../../use-unique-id';
import styles from '../styles';

export interface AskFormProps {
  // The field's label
  label: string;
  buttonText?: string;
  // Shown above the field, saying what's being asked for
  info?: ComponentChildren;
  // Hidden with a class rather than unmounted, so what's typed survives a status change
  hidden?: boolean;
  // Called with what was typed when the button is clicked; true (or a promise of true: it worked) clears the field, so
  // the form is empty when it's opened again. Anything else keeps what was typed, to fix. In an AskLoader a promise
  // shows the loader until it settles
  onSubmit?: (value: string) => boolean | void | Promise<boolean | void>;
  // Given, a Cancel button sits beside the main one (and Escape in the field does the same): for a form opened on
  // request that has to be closable without saving (a guide site's + or pencil). Cancelling clears the field
  onCancel?: () => void;
}

const clear = (input: HTMLInputElement): void => {
  input.value = '';
};

// Asks for something a feature couldn't find itself: an optional line of text, a labelled field and a button
export const AskForm = ({ label, buttonText = 'Save', info, hidden = false, onSubmit, onCancel }: AskFormProps) => {
  // Pairs the label with its field
  const fieldId = useUniqueId('ta-x-ask-form-field');
  const field = useRef<HTMLInputElement>(null);
  const openedOnRequest = onCancel !== undefined;

  // Opened on request (+ or the pencil, which go away as it shows), the field takes the focus, so the keyboard carries on
  // there. A form shown by itself (nothing linked yet) leaves the focus where it is
  useLayoutEffect(() => {
    if (openedOnRequest && !hidden) {
      field.current?.focus();
    }
  }, [openedOnRequest, hidden]);

  const send = (): void => {
    // Held before onSubmit: the feature may re-render straight away without the form, emptying the ref
    const input = field.current;
    if (!input) {
      return;
    }

    const result = onSubmit?.(input.value);
    if (result === true) {
      clear(input);
    } else if (result instanceof Promise) {
      // A rejection is the caller's to handle (an AskLoader shows the form again); here it just keeps the field
      result.then(
        (worked) => worked === true && clear(input),
        () => undefined
      );
    }
  };

  const cancelForm = (): void => {
    if (field.current) {
      clear(field.current);
    }

    onCancel?.();
  };

  const submit: MouseEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    send();
  };

  const cancel: MouseEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    cancelForm();
  };

  // Enter sends, as the button does. Left alone it would submit the site's page form through its first submit button
  // (the settings menu's Add Keyword), and what was typed would go nowhere. Escape cancels, where the form can be
  // cancelled
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      send();
    } else if (event.key === 'Escape' && onCancel) {
      // Kept from the page, as Enter is (the settings menu closes on Escape)
      event.preventDefault();
      event.stopPropagation();
      cancelForm();
    }
  };

  const save = <input type="submit" value={buttonText} class="button" onClick={submit} />;

  return (
    <div class={classNames(styles.askLoaderAsk, hidden && hideClass)}>
      {info !== undefined && <p>{info}</p>}

      <div>
        <label for={fieldId} class="small">
          {label}
        </label>
        <input ref={field} type="text" id={fieldId} class="textbox cs-n" onKeyDown={onKeyDown} />
      </div>

      {onCancel ? (
        // The main button first, Cancel on the right
        <div class={styles.askLoaderAskButtons}>
          {save}
          <input type="button" value="Cancel" class="button" onClick={cancel} />
        </div>
      ) : (
        save
      )}
    </div>
  );
};
