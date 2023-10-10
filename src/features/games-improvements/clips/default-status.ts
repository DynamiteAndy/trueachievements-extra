import { Cache, gameClips } from '@ta-x-globals';
import { allConcurrently, waitForElement } from '@ta-x-utilities';

export const changeToDefaultStatus = async (): Promise<void> => {
  if (!gameClips.gameClipsDefaultStatus) {
    return;
  }

  await allConcurrently(
    'game-clips-change-to-default-status',
    [
      {
        name: 'game-clips-change-to-default-status-recorded-by',
        task: async (): Promise<void> =>
          await changeSelectOption('#ddlRecordedBy', gameClips.gameClipsDefaultRecordedByValue, '')
      },
      {
        name: 'game-clips-change-to-default-status-saved-by',
        task: async (): Promise<void> =>
          await changeSelectOption('#ddlSavedBy', gameClips.gameClipsDefaultSavedByValue, 'Gamer')
      },
      {
        name: 'game-clips-change-to-default-status-recorded',
        task: async (): Promise<void> =>
          await changeSelectOption('#ddlUploaded', gameClips.gameClipsDefaultRecordedValue, '7')
      },
      {
        name: 'game-clips-change-to-default-status-sort-by',
        task: async (): Promise<void> =>
          await changeSelectOption('#ddlOrder', gameClips.gameClipsDefaultSortByValue, 'Most viewed')
      }
    ],
    1
  );
};

const changeSelectOption = async (selector: string, newValue: string, defaultValue: string): Promise<void> => {
  const selectorArray = Cache.gameClipsDefaultStatusSelectors;

  if (newValue === defaultValue) {
    return;
  }
  if (selectorArray.includes(selector)) {
    return;
  }

  selectorArray.push(selector);
  Cache.gameClipsDefaultStatusSelectors = selectorArray;

  const selectOption = (await waitForElement(selector)) as HTMLSelectElement;

  if (selectOption.value === newValue) {
    return;
  }

  selectOption.value = newValue;
  selectOption.onchange(null);
};

export default { changeToDefaultStatus };
