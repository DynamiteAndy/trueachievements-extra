import { settings } from '@ta-x-storage';
import { renderFragment, setSettings, shownSettings } from '@ta-x-test';
import { settingId } from '@ta-x-ui';

import { ThreadFilterSettings, type ThreadFilterSettingsProps } from './ThreadFilterSettings';

describe('forum/shared/ThreadFilterSettings', () => {
  const myThreads = settings.forum.myThreads;
  const props: ThreadFilterSettingsProps = {
    override: myThreads.overrideForumThreadFilter,
    threadFilter: myThreads.threadFilter,
    keywords: myThreads.threadFilterKeywords
  };
  const override = settingId(myThreads.overrideForumThreadFilter);
  const filter = settingId(myThreads.threadFilter);
  const on = (): void =>
    setSettings({
      'forum.myThreads.overrideForumThreadFilter': true,
      'forum.myThreads.threadFilter': true
    });
  // Each row's label and how it sits in the toggles' group (its row classes)
  const rows = (rowProps: ThreadFilterSettingsProps) =>
    [...renderFragment(<ThreadFilterSettings {...rowProps} />).children].map((row) => [
      row.querySelector('label')?.textContent.trim(),
      [...row.classList].filter((name) => name.startsWith('ta-x-hide-'))
    ]);

  test('shows the override, the filter under it and the keywords under that while both are on', () => {
    on();

    expect(rows(props)).toEqual([
      ['Override Forum Settings', ['ta-x-hide-border-when-checked']],
      ['Hide Threads By Keyword', ['ta-x-hide-padding-top', 'ta-x-hide-border-when-checked']],
      ['Keywords', ['ta-x-hide-padding-top']]
    ]);
  });

  test('shows the filter first, with its keywords under it, for a group without an override (the forums)', () => {
    setSettings({ 'forum.myThreads.threadFilter': true });

    expect(rows({ threadFilter: props.threadFilter, keywords: props.keywords })).toEqual([
      ['Hide Threads By Keyword', ['ta-x-hide-border-when-checked']],
      ['Keywords', ['ta-x-hide-padding-top']]
    ]);
  });

  test('says what the override leaves to the forums while it is off', () => {
    expect(renderFragment(<ThreadFilterSettings {...props} />).textContent).toContain(
      'Some settings will be inherited from the Forums tab.'
    );
  });

  test.each([
    { case: 'the override is off', values: {}, shown: [override] },
    {
      case: 'the filter is off',
      values: { 'forum.myThreads.overrideForumThreadFilter': true },
      shown: [override, filter]
    }
  ])('leaves out the rows that depend on it while $case', ({ values, shown }) => {
    setSettings(values);

    expect(shownSettings(<ThreadFilterSettings {...props} />)).toEqual(shown);
  });

  test('shows the filter at once for a group without an override (the forums)', () => {
    expect(shownSettings(<ThreadFilterSettings threadFilter={props.threadFilter} keywords={props.keywords} />)).toEqual(
      [filter]
    );
  });
});
