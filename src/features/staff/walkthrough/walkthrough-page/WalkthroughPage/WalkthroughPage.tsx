import { addClasses, moveInto } from '@ta-x-page';
import { applyLive, settings } from '@ta-x-storage';
import { createPortal } from 'preact';
import { useLayoutEffect, useMemo, useState } from 'preact/hooks';

import { useElement } from '../../shared';
import { StickyPageHistory } from '../StickyPageHistory';
import styles from '../styles';
import { WalkthroughTeamButton } from '../WalkthroughTeamButton';

const { walkthroughPage } = settings.staff.walkthrough;

// The edit / unlock buttons the site puts over the preview (the first group found is moved)
const editButtons = '#btnEditPage, #btnEditPage2, #btnUnlockWalkthroughPage, #btnUnlockWalkthroughPage2';

interface WalkthroughPageProps {
  // The site's page history (#chWalkthroughPageVersions); the controller is mounted where it is
  pageVersions: HTMLElement;
}

// A controller for the staff walkthrough page: it renders a container where the site's page history was, moves the
// history and the preview into it side by side, and adds the page's options to them: the sticky page history, the
// walkthrough team button, the edit buttons moved to the history, and the lock notice highlighted. Everything it moves
// or marks goes back as it was on unmount. Every option applies live (read with .value, so a change in the menu
// re-renders and their effects follow)
export const WalkthroughPage = ({ pageVersions }: WalkthroughPageProps) => {
  const options = {
    stickyPageHistory: walkthroughPage.stickyPageHistory.value,
    walkthroughTeamButton: walkthroughPage.walkthroughTeamButton.value,
    moveButtonsToLeft: walkthroughPage.moveButtonsToLeft.value,
    highlightPageLocked: walkthroughPage.highlightPageLocked.value
  };
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  // Set once the page history is in the container, which the sticky page history sticks within
  const [ready, setReady] = useState(false);
  const preview = useElement('#chWalkthroughPagePreview', document.documentElement);
  const historyButtons = useElement('.content .buttons', pageVersions);
  const previewButtons = useElement(editButtons, container, options.moveButtonsToLeft);
  const lockNotice = useElement('.walkthroughlocked', container, options.highlightPageLocked);

  // While mounted, changing these needs no reload, so the settings menu's notice leaves them out. A layout effect, so
  // unmounting unregisters them at once (Preact runs a passive effect's cleanup after the next paint)
  useLayoutEffect(
    () =>
      applyLive(
        walkthroughPage.stickyPageHistory,
        walkthroughPage.walkthroughTeamButton,
        walkthroughPage.moveButtonsToLeft,
        walkthroughPage.highlightPageLocked
      ),
    []
  );

  useLayoutEffect(() => {
    if (!container) {
      return undefined;
    }

    const putBack = moveInto(container, [pageVersions]);
    setReady(true);

    return putBack;
  }, [container, pageVersions]);

  useLayoutEffect(() => (container && preview ? moveInto(container, [preview]) : undefined), [container, preview]);

  // The option is checked as well: the buttons stay found once the option is turned off
  useLayoutEffect(() => {
    const from = previewButtons?.parentElement;

    if (!options.moveButtonsToLeft || !container || !historyButtons || !from) {
      return undefined;
    }

    const putBack = moveInto(historyButtons, [...from.childNodes]);
    const giveClassBack = addClasses(container, styles.walkthroughPageMoveButtonsToLeft);

    return () => {
      putBack();
      giveClassBack();
    };
  }, [options.moveButtonsToLeft, container, historyButtons, previewButtons]);

  // The option is checked as well: the notice stays found once the option is turned off. Taken off again only if we put
  // it on (addClasses)
  useLayoutEffect(
    () => (lockNotice && options.highlightPageLocked ? addClasses(lockNotice, 'informationpanel') : undefined),
    [lockNotice, options.highlightPageLocked]
  );

  // Authors already get the site's own Back to management button. Checked once, when the history's buttons are found,
  // before ours renders there (ours has the same id, so checking again would find our own)
  const siteHasTeamButton = useMemo(
    () => historyButtons !== null && document.querySelector('#btnBackToWalkthrough') !== null,
    [historyButtons]
  );
  const teamButtonTarget = options.walkthroughTeamButton && !siteHasTeamButton ? historyButtons : null;

  return (
    <>
      <div ref={setContainer} class={styles.walkthroughPageContainer} />
      {ready && container && options.stickyPageHistory && (
        <StickyPageHistory container={container} pageVersions={pageVersions} />
      )}
      {teamButtonTarget && createPortal(<WalkthroughTeamButton />, teamButtonTarget)}
    </>
  );
};
