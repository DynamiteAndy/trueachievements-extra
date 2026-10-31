import { EditWalkthroughSettings } from '../edit-walkthrough-page/EditWalkthroughSettings';
import { ManageWalkthroughSettings } from '../manage-walkthrough/ManageWalkthroughSettings';
import { WalkthroughPageSettings } from '../walkthrough-page/WalkthroughPageSettings';
import { WalkthroughPreviewSettings } from '../walkthrough-preview/WalkthroughPreviewSettings';

// The settings menu's Staff tab
export const StaffWalkthroughSettings = () => (
  <>
    <EditWalkthroughSettings />
    <ManageWalkthroughSettings />
    <WalkthroughPageSettings />
    <WalkthroughPreviewSettings />
  </>
);
