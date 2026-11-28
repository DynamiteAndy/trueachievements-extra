import { Section, WalkthroughThanks, type AskLoaderState } from '@ta-x-ui';

import {
  WalkthroughAchievementsSection,
  type WalkthroughAchievementsSectionProps
} from '../WalkthroughAchievementsSection';
import { WalkthroughInformation } from '../WalkthroughInformation';
import { WalkthroughPagesSection, type WalkthroughPagesSectionProps } from '../WalkthroughPagesSection';

export interface WalkthroughPreview {
  // Only on a page's preview, above the thanks and achievements
  pages: WalkthroughPagesSectionProps | null;
  // The walkthrough's thanks count and its forum thread
  thanks: { total: string; thread: string };
  achievements: WalkthroughAchievementsSectionProps['achievements'];
}

interface WalkthroughPreviewAsideProps {
  status?: AskLoaderState;
  walkthrough?: WalkthroughPreview;
  // Asking again after an id typed in wasn't found
  notFound?: boolean;
  // Called with the walkthrough id typed in when the page's walkthrough isn't known yet
  onSave: (walkthroughId: string) => Promise<void>;
}

// What the extension adds to a walkthrough preview's aside: the information section while it finds the walkthrough
// (or asks for it), then the walkthrough's own sections in its place
export const WalkthroughPreviewAside = ({ status, walkthrough, notFound, onSave }: WalkthroughPreviewAsideProps) =>
  status === 'loaded' && walkthrough ? (
    <>
      {walkthrough.pages && <WalkthroughPagesSection {...walkthrough.pages} />}
      {/* The site's Walkthrough Thanks section */}
      <Section colour="purple" class="walkthroughthanks" title="Walkthrough Thanks">
        <WalkthroughThanks count={walkthrough.thanks.total} />
        <p>community members have thanked the author.</p>
        <p class="thread">
          Discuss this walkthrough in its <a href={walkthrough.thanks.thread}>Walkthrough Thread</a>.
        </p>
      </Section>
      <WalkthroughAchievementsSection achievements={walkthrough.achievements} />
    </>
  ) : (
    <WalkthroughInformation status={status} notFound={notFound} onSave={onSave} />
  );
