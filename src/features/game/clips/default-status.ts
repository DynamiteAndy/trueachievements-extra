import { isFreshArrival, triggerEvent, waitForElementWhileParsing } from '@ta-x-page';
import { settings } from '@ta-x-storage';

const { clips } = settings.game;

// The setting stores "Anyone" as '', but the site's Anyone option has no value attribute, so its value is its text
const siteValue = (value: string): string => (value === '' ? 'Anyone' : value);

// Each of the clips page's filter dropdowns with the value the user chose for it
const dropdowns = (): [selector: string, value: string][] => [
  ['#ddlRecordedBy', siteValue(clips.defaultRecordedByValue.peek())],
  ['#ddlSavedBy', siteValue(clips.defaultSavedByValue.peek())],
  ['#ddlUploaded', clips.defaultRecordedValue.peek()],
  ['#ddlOrder', clips.defaultSortByValue.peek()]
];

// Sets the clips page's filters to the user's defaults on arriving at it (so a filter the user picks afterwards, which
// posts the page back to itself, sticks). Every dropdown that differs is set first and then one posts back: the site's
// Postback submits the whole form, so a single post back carries them all
export const changeToDefaultStatus = async (): Promise<void> => {
  if (!clips.defaultStatus.peek() || !isFreshArrival()) {
    return;
  }

  const changed: HTMLSelectElement[] = [];

  for (const [selector, value] of dropdowns()) {
    const select = await waitForElementWhileParsing<HTMLSelectElement>(selector);

    if (!select || select.value === value || ![...select.options].some((option) => option.value === value)) {
      continue;
    }

    select.value = value;
    changed.push(select);
  }

  const last = changed.at(-1);
  if (last) {
    triggerEvent(last, 'change');
  }
};
