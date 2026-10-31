import { until, allConcurrently } from '@ta-x-lib';
import { mount, waitForElement } from '@ta-x-page';
import { StaffRegex } from '@ta-x-site';

import { addMissingButtons } from './add-missing-buttons';
import { autoSelectFirst } from './auto-select-first';
import { changeToDefaultStatus } from './default-status';
import { ManageWalkthrough } from './ManageWalkthrough';

// Mounts the page's controller after the walkthrough's details, once the site has drawn its panels (a walkthrough
// selected). Returns its unmount
const mountManageWalkthrough = async (): Promise<(() => void) | undefined> => {
  const holder = await waitForElement('#divWalkthroughHolder');

  if (!holder) {
    return undefined;
  }

  const editWalkthrough = await waitForElement('#chEditWalkthrough', { root: holder });

  if (!editWalkthrough || !(await until(() => holder.childElementCount > 2, 1000))) {
    return undefined;
  }

  return mount(<ManageWalkthrough holder={holder} />, holder, editWalkthrough.nextSibling).unmount;
};

// Resolves once its batch has finished, with what unmounts the controller (when it mounted one)
export default async (): Promise<(() => void) | undefined> => {
  if (!StaffRegex.Walkthroughs.Test.manageWalkthroughUrl()) {
    return undefined;
  }

  // The rest waits for the page the status posts back to: there, Auto Select First picks from the filtered list
  if (await changeToDefaultStatus()) {
    return undefined;
  }
  await autoSelectFirst();
  const unmount = await mountManageWalkthrough();

  // Add missing buttons hands back its stop, which nothing here needs
  await allConcurrently<unknown>('Manage Walkthrough', [
    { name: 'staff:walkthrough:manage-walkthrough:add-missing-buttons', task: addMissingButtons }
  ]);

  return unmount;
};
