import { logger } from '@ta-x-lib';
import { useEffect, useState } from 'preact/hooks';

import type { AskLoaderState } from '@ta-x-ui';

import { type Found, findThreadsOwnerProgress, getOwnerProgress, resolveWalkthroughUrl } from '../find-owner-progress';
import { ShowOwnerProgress } from '../ShowOwnerProgress';

// The section, owning its status and what it found. Dev builds switch its status with Preact DevTools (its useState)
export const OwnerProgressSection = () => {
  // While changing, what was shown before stays, for Cancel to go back to
  const [current, setCurrent] = useState<{ status: AskLoaderState; found?: Found; changing?: boolean }>({
    status: 'loading'
  });
  const show = (found: Found | null): void =>
    setCurrent((previous) =>
      found
        ? { status: 'loaded', found }
        : // A changed link that doesn't lead to one keeps asking, still with Cancel back to the one shown
          { status: 'ask', found: previous.changing ? previous.found : undefined, changing: previous.changing }
    );
  const change = (): void => setCurrent((previous) => ({ ...previous, status: 'ask', changing: true }));
  const cancel = (): void => setCurrent((previous) => ({ status: 'loaded', found: previous.found }));

  // Looks the thread's walkthrough up when it opens; if its page doesn't load (e.g. a dead link's 404), it asks for the
  // link rather than loading for good
  useEffect(() => {
    findThreadsOwnerProgress()
      .then(show)
      .catch((error: unknown) => {
        logger.warn('show-owner-progress', "the thread's walkthrough couldn't be read", error);
        show(null);
      });
  }, []);

  // A link typed into the ask panel: its AskLoader shows the loader meanwhile, and the panel again if the walkthrough
  // doesn't load (or the lookup rejects: one `new URL` can't read even against the page). One that isn't a
  // walkthrough's, or leads to another site, leaves the panel as it is. Resolves whether it was found, which clears the
  // field (empty when the pencil opens it again); one that wasn't stays, to fix
  const save = async (value: string): Promise<boolean> => {
    const url = value === '' ? null : await resolveWalkthroughUrl(value);
    if (!url) {
      return false;
    }

    const ownerProgress = await getOwnerProgress(url);
    show(ownerProgress && { url, ownerProgress });
    return ownerProgress !== null;
  };

  return (
    <ShowOwnerProgress
      status={current.status}
      ownerProgress={current.found?.ownerProgress}
      url={current.found?.url}
      onSave={save}
      onChange={change}
      onCancel={current.changing ? cancel : undefined}
    />
  );
};
