import { logger } from '@ta-x-lib';
import { useEffect, useState } from 'preact/hooks';

import type { AskLoaderState } from '@ta-x-ui';

import { findPreviewsWalkthrough, type Found, getAsideContent } from '../aside-content';
import { hideAside } from '../hide-aside';
import { type WalkthroughPreview, WalkthroughPreviewAside } from '../WalkthroughPreviewAside';

// The aside, owning its status and the walkthrough it found. Dev builds switch its status with Preact DevTools (its
// useState)
export const PreviewAside = () => {
  const [current, setCurrent] = useState<{
    status: AskLoaderState;
    walkthrough?: WalkthroughPreview;
    // Asking again after an id typed in wasn't found
    notFound?: boolean;
  }>({
    status: 'loading'
  });
  const [removed, setRemoved] = useState(false);

  const show = (found: Found): void => {
    if (found === 'remove') {
      setRemoved(true);
      return;
    }

    setCurrent(found ? { status: 'loaded', walkthrough: found } : { status: 'ask' });
  };

  // Looks the walkthrough up when the preview opens; if its pages don't load (e.g. the site erred), it asks for the
  // walkthrough rather than loading for good
  useEffect(() => {
    findPreviewsWalkthrough()
      .then(show)
      .catch((error: unknown) => {
        logger.warn('walkthrough-preview', "the side column's walkthrough couldn't be read", error);
        show(null);
      });
  }, []);

  useEffect(() => {
    if (removed) {
      // Its waits give up with null rather than rejecting
      void hideAside();
    }
  }, [removed]);

  // A walkthrough id typed into the ask panel: its AskLoader shows the loader meanwhile. One that isn't a whole number,
  // or a walkthrough that isn't found, can't be shown or doesn't load, asks again saying so, so another can be tried:
  // the side column stays, as the id was the gamer's own
  const save = async (typed: string): Promise<void> => {
    const walkthroughId = typed.trim();
    if (walkthroughId === '') {
      return;
    }

    const notFound = (): void => setCurrent({ status: 'ask', notFound: true });

    if (!/^\d+$/.test(walkthroughId)) {
      notFound();
      return;
    }

    try {
      const found = await getAsideContent(walkthroughId);

      if (found === 'remove' || found === null) {
        notFound();
      } else {
        show(found);
      }
    } catch (error) {
      logger.warn('walkthrough-preview', `walkthrough ${walkthroughId} couldn't be read`, error);
      notFound();
    }
  };

  return removed ? null : <WalkthroughPreviewAside {...current} onSave={save} />;
};
