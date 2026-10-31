import { settings } from '@ta-x-storage';
import { Accordion, CheckboxSetting, SelectSetting, type SelectSettingOption, settingRowClasses } from '@ta-x-ui';

// The sale table columns to sort by. A value with a comma lists the names one column has on different tables (Product
// or Game)
const sortByOptions: SelectSettingOption[] = [
  { value: 'product,game', text: 'Product' },
  { value: 'sale-price', text: 'Sale Price' },
  { value: 'discount', text: 'Discount' },
  { value: 'completion-time', text: 'Completion Time' },
  { value: 'ta-ratio', text: 'TA Ratio' }
];

const sortOrderOptions: SelectSettingOption[] = [
  { value: 'asc', text: 'Ascending' },
  { value: 'desc', text: 'Descending' }
];

// Sorting by these columns doesn't work on every table
const unreliableSortColumns = ['completion-time', 'ta-ratio'];

// Sale articles' settings in the settings menu's News tab
export const SalesSettings = () => {
  const sales = settings.news.sales;
  const sorting = sales.autoSortBy.value;
  const highlighting = sales.highlightWishlistItems.value;
  const unreliableSort = sales.autoSortByValue.value.some((column) => unreliableSortColumns.includes(column));

  return (
    <Accordion title="Sales" contentClasses="t-settings">
      <CheckboxSetting
        label="Default Sort"
        setting={sales.autoSortBy}
        containerClasses={settingRowClasses.noBorderWhenChecked}
      />

      {sorting && (
        <>
          <SelectSetting
            label="Sort by"
            setting={sales.autoSortByValue}
            containerClasses={settingRowClasses.underToggleNoBorder}
            helperText={
              unreliableSort ? 'This option may not work on some tables. Let me know what you spot!' : undefined
            }
            options={sortByOptions}
          />

          <SelectSetting
            label="Order"
            setting={sales.autoSortByOrder}
            containerClasses={settingRowClasses.underToggle}
            options={sortOrderOptions}
          />
        </>
      )}

      <CheckboxSetting label="Hide Owned Items" setting={sales.hideOwnedItems} />

      <CheckboxSetting label="Hide Unobtainable Items" setting={sales.hideUnobtainableItems} />

      <CheckboxSetting
        label="Highlight Wishlist Items"
        setting={sales.highlightWishlistItems}
        containerClasses={settingRowClasses.noBorderWhenChecked}
      />

      {highlighting && (
        <CheckboxSetting
          label="Include Bundles With Wishlist Items"
          setting={sales.highlightBundlesContainingWishlistItems}
          containerClasses={settingRowClasses.underToggle}
        />
      )}

      <CheckboxSetting label="Collapsible Groups" setting={sales.collapsibleGroups} />
    </Accordion>
  );
};
