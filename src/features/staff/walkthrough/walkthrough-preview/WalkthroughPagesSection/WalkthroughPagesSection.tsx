import { Section } from '@ta-x-ui';

import { WalkthroughPageRow } from '../WalkthroughPageRow';
import { WalkthroughSummaryRow } from '../WalkthroughSummaryRow';

import type { AsideContentPreviewPage } from '../aside-content';

export interface WalkthroughPagesSectionProps {
  walkthroughId: string;
  walkthroughName: string;
  pages: AsideContentPreviewPage[];
  // The page being previewed, which isn't a link
  currentPageId: string;
}

// The site's page index, as the published walkthrough's aside shows it
export const WalkthroughPagesSection = ({
  walkthroughId,
  walkthroughName,
  pages,
  currentPageId
}: WalkthroughPagesSectionProps) => (
  <Section colour="purple" class="page-index" title="Pages In This Walkthrough">
    <table class="wt-pl">
      <tbody>
        <WalkthroughSummaryRow walkthroughId={walkthroughId} walkthroughName={walkthroughName} />
        {pages.map((page) => (
          <WalkthroughPageRow key={page.id} page={page} selected={page.id === currentPageId} />
        ))}
      </tbody>
    </table>
  </Section>
);
