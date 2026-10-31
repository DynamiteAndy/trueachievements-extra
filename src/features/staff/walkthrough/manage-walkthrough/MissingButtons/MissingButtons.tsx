import { PostbackButton } from '../../shared';

// The Action menu's page buttons, which the site leaves out while a page is selected
export const MissingButtons = () => (
  <div class="buttons">
    <PostbackButton postback="btnAddPage" icon="/images/icons/addtotrophycasesmall.png" text="Add page" wrapText />
    <PostbackButton postback="btnPreview" icon="/images/icons/previewwalkthrough.png" text="Preview" wrapText />
    <PostbackButton
      postback="btnViewContent"
      icon="/images/icons/previewwalkthrough.png"
      text="View and edit content"
      wrapText
    />
  </div>
);
