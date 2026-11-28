import { classNames } from '@ta-x-lib';
import { useState } from 'preact/hooks';

import type { ComponentChildren } from 'preact';

import { Loader } from '../../icons/Loader';
import { AskForm, type AskFormProps } from '../AskForm';
import attributes from '../attributes';
import styles from '../styles';

// loading: the loader shows. ask: the ask form shows. loaded: neither, the feature's content (children) shows.
export type AskLoaderState = 'loading' | 'ask' | 'loaded';

interface AskLoaderProps {
  status?: AskLoaderState;
  // The feature's own classes
  class?: string;
  // The ask form, shown while status is ask; left out when the feature never asks. An onSubmit that returns a promise
  // (the feature looking up what was typed) shows the loader until it settles: the feature sets status loaded when it
  // finds what it needs, and if it doesn't (or the promise fails, e.g. a page that didn't load) the form shows again
  ask?: Omit<AskFormProps, 'hidden'>;
  // The feature's content, shown once loaded
  children?: ComponentChildren;
}

// Shows a loader while a feature finds what it needs, asks for it when it can't, and shows the feature's content once
// found. The feature re-renders it with a new status. It has no section of its own: put it in one (Section) if needed.
export const AskLoader = ({ status = 'loading', class: classes, ask, children }: AskLoaderProps) => {
  // While what was typed into the form is being looked up
  const [saving, setSaving] = useState(false);
  const shown = saving ? 'loading' : status;

  // The form clears its field when the result (or its promise) is true
  const submit = (value: string): boolean | void | Promise<boolean | void> => {
    const result = ask?.onSubmit?.(value);

    if (result instanceof Promise) {
      setSaving(true);
      result.catch(() => undefined).finally(() => setSaving(false));
    }

    return result;
  };

  return (
    <div
      class={classNames(styles.askLoaderContainer, classes)}
      {...{ [attributes.askContentLoaded]: shown === 'loading' ? undefined : 'true' }}
    >
      {shown === 'loading' && (
        <div class={styles.articleLoader}>
          <p>Please wait, loading.</p>
          <Loader />
        </div>
      )}

      {ask && <AskForm {...ask} onSubmit={submit} hidden={shown !== 'ask'} />}

      {shown === 'loaded' && children}
    </div>
  );
};
