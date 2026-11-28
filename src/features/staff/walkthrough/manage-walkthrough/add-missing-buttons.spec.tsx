import { settings } from '@ta-x-storage';
import { expectAppliesLive, find, ids, neverFinds, required, setHtml, setSettings, tick } from '@ta-x-test';

import { addMissingButtons } from './add-missing-buttons';

describe('staff/walkthrough/manage-walkthrough/add-missing-buttons', () => {
  const readyForReview = (): HTMLAnchorElement | null => document.querySelector('#btnReadyForReview');
  const missingButtons = (): HTMLElement | null =>
    document.querySelector(missingButtonsSelector)?.parentElement ?? null;
  // Ours is the only Add page button: the site's shows only once the page is being added
  const missingButtonsSelector = `a[href="javascript:Postback('btnAddPage')"]`;
  const siteButtons = (): HTMLElement | null => find('#btnCancel').parentElement;
  // Runs it, stopping it when the test ends
  const run = async (): Promise<void> => {
    onTestFinished(addMissingButtons());
    await tick();
  };

  beforeEach(() => {
    setSettings({ 'staff.walkthrough.manageWalkthrough.addMissingButtons': true });
  });

  describe('page selected', () => {
    beforeEach(() => {
      setHtml('@ta-x-test-views/staff-manage-walkthrough/page-selected.html');
    });

    test('should add ready for review before the site buttons, once', async () => {
      await run();

      expect(required(siteButtons()).firstElementChild).toBe(readyForReview());
      expect(ids(required(siteButtons()))).toEqual(['btnReadyForReview', 'btnCancel', 'btnSave']);
      expect(document.querySelectorAll('#btnReadyForReview')).toHaveLength(1);
    });

    test('should add the missing buttons between the page fields and the site buttons', async () => {
      await run();

      expect(required(required(missingButtons()).previousElementSibling).id).toBe('divEditPage');
      expect(required(missingButtons()).nextElementSibling).toBe(siteButtons());
      expect(document.querySelectorAll(missingButtonsSelector)).toHaveLength(1);
    });

    test('should apply live: on, off and on again from the menu, off giving the page back exactly', async () => {
      setSettings({ 'staff.walkthrough.manageWalkthrough.addMissingButtons': false });
      await run();

      await expectAppliesLive(settings.staff.walkthrough.manageWalkthrough.addMissingButtons);
    });
  });

  describe('page selected, without the buttons row', () => {
    beforeEach(() => {
      setHtml('@ta-x-test-views/staff-manage-walkthrough/page-selected.html');
      find('#chEditWalkthrough .buttons').remove();
    });

    test('should add nothing, without throwing', async () => {
      await run();

      expect(readyForReview()).toBeNull();
      expect(missingButtons()).toBeNull();
    });
  });

  describe('no page selected', () => {
    beforeEach(() => {
      setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html');
    });

    test('should not add the buttons without the page fields', async () => {
      neverFinds('#txtPageName');

      await run();

      expect(readyForReview()).toBeNull();
      expect(missingButtons()).toBeNull();
    });
  });
});
