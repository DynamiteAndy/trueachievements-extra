import { walkthroughPreviewPath } from '../../shared';

interface WalkthroughSummaryRowProps {
  walkthroughId: string;
  walkthroughName: string;
}

// The first row of the site's page index, which links back to the walkthrough as "<name> Walkthrough"
export const WalkthroughSummaryRow = ({ walkthroughId, walkthroughName }: WalkthroughSummaryRowProps) => (
  <tr>
    <td />
    <td>
      <a href={walkthroughPreviewPath(walkthroughId)}>{walkthroughName} Walkthrough</a>
    </td>
  </tr>
);
