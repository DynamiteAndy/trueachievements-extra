import { AskLoader, Section, type AskLoaderState } from '@ta-x-ui';

import { previewStatusesText } from '../preview-statuses';
import styles from '../styles';

interface WalkthroughInformationProps {
  status?: AskLoaderState;
  // Asking again after an id typed in wasn't found, which the panel says
  notFound?: boolean;
  // Called with the walkthrough id typed in when the page's walkthrough isn't known yet
  onSave: (walkthroughId: string) => Promise<void>;
}

export const WalkthroughInformation = ({ status, notFound = false, onSave }: WalkthroughInformationProps) => (
  <Section colour="purple" class={styles.populateAsideContent} title="Walkthrough Information">
    <AskLoader
      status={status}
      ask={{
        info: notFound
          ? `That walkthrough couldn't be found. Please check its id and try again. This works for ${previewStatusesText} walkthroughs.`
          : `Can't automate them all sadly! Please enter the walkthrough id to link this page to the walkthrough, I'll try remember it next time! This works for ${previewStatusesText} walkthroughs.`,
        label: 'Walkthrough Id',
        onSubmit: onSave
      }}
    />
  </Section>
);
