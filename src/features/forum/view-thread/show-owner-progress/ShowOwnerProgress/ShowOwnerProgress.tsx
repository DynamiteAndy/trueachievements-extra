import {
  AskLoader,
  EditableHeader,
  Pencil,
  Section,
  WalkthroughThanks,
  type AskLoaderState,
  type WalkthroughThanksProps
} from '@ta-x-ui';

import styles from '../styles';
import { WalkthroughEditors, type WalkthroughEditorRow } from '../WalkthroughEditors';

// A published walkthrough's gamers involved and its thanks
export interface OwnerProgress {
  editors: WalkthroughEditorRow[];
  thanks: WalkthroughThanksProps | null;
}

interface ShowOwnerProgressProps {
  status?: AskLoaderState;
  ownerProgress?: OwnerProgress;
  // The walkthrough's address, shown once loaded with a pencil to change it
  url?: string;
  // Called with the walkthrough link typed in when the thread's own posts don't have one, or to change it; resolves
  // whether it was found (which clears the field)
  onSave: (url: string) => Promise<boolean>;
  // The pencil: asks for another link
  onChange?: () => void;
  // Given while changing: the form's Cancel, back to the walkthrough shown
  onCancel?: () => void;
}

// The address's path, e.g. /game/Alan-Wake-2/walkthrough
const shortUrl = (url: string): string => new URL(url).pathname;

export const ShowOwnerProgress = ({
  status,
  ownerProgress,
  url,
  onSave,
  onChange,
  onCancel
}: ShowOwnerProgressProps) => (
  <Section colour="purple" class={styles.showOwnerProgress} title="Walkthrough Information">
    <AskLoader
      status={status}
      ask={{
        // Changing, the section already says what it's for
        info: onCancel
          ? undefined
          : "Can't automate them all sadly! Please enter a direct link to the walkthrough page to link this thread to the walkthrough, I'll remember it next time!",
        label: 'Walkthrough Url',
        onSubmit: onSave,
        onCancel
      }}
    >
      {ownerProgress && (
        <>
          <WalkthroughEditors rows={ownerProgress.editors} />
          {ownerProgress.thanks && <WalkthroughThanks {...ownerProgress.thanks} />}
        </>
      )}
    </AskLoader>
    {/* Below the ask loader, which lays the editors and thanks side by side: a line of its own, once loaded */}
    {status === 'loaded' && url && (
      <div class={styles.showOwnerProgressLink}>
        <EditableHeader
          label="Linked walkthrough"
          icon={<Pencil />}
          actionTitle="Change the walkthrough"
          onAction={onChange}
        />
        <a href={url}>{shortUrl(url)}</a>
      </div>
    )}
  </Section>
);
