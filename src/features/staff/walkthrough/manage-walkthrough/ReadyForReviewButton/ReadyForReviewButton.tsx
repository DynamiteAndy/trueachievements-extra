import { PostbackButton } from '../../shared';

// Mirrors the site's own Ready for review button, which it hides while a page is selected
export const ReadyForReviewButton = () => (
  <PostbackButton
    postback="btnReadyForReview_click"
    icon="/images/icons/eye.png"
    text="Ready for review"
    id="btnReadyForReview"
    title="Ready for review"
  />
);
