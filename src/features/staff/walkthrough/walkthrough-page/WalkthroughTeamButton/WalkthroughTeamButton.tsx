import { PostbackButton } from '../../shared';

// Mirrors the site's own Back to management button, which editors don't get
export const WalkthroughTeamButton = () => (
  <PostbackButton
    postback="btnBackToWalkthrough_click"
    icon="/images/icons/leftarrow.png"
    text="Back to management"
    id="btnBackToWalkthrough"
    title="Back to management"
  />
);
