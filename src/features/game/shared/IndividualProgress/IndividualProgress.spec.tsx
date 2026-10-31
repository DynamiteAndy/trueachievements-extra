import { mountForTest, required, setHtml } from '@ta-x-test';

import { getBaseGroupHeader, getDlcGroupHeaders, groupTitle } from '../achievement-groups';
import { progressOf } from '../individual-progress.spec-helpers';

import { IndividualProgress, type AchievementGroup } from './IndividualProgress';

describe('IndividualProgress', () => {
  const baseHeader = (): HTMLElement => required(getBaseGroupHeader(document));
  // A group with nothing won, named and totalled as `header` gives it
  const nothingWon = (header: HTMLElement): AchievementGroup => {
    const progress = required(progressOf(header));

    return {
      title: groupTitle(header),
      maxTAScore: progress.trueAchievement,
      maxGamerScore: progress.gamerscore,
      maxAchievements: progress.achievements,
      achievements: []
    };
  };

  beforeEach(() => {
    setHtml('@ta-x-test-views/game-achievements/won-with-dlc.html');
  });

  test("should show each of a header's stats as won of its total while mounted", () => {
    const header = baseHeader();
    const totals = required(progressOf(header));

    mountForTest(
      <IndividualProgress headers={[header]} groups={[nothingWon(header)]} />,
      document.createElement('div')
    );

    expect(progressOf(header)).toEqual({
      trueAchievement: `0/${totals.trueAchievement}`,
      gamerscore: `0/${totals.gamerscore}`,
      achievements: `0/${totals.achievements}`
    });
  });

  test('should leave a header no group is named after as it is', () => {
    const [dlcHeader] = getDlcGroupHeaders(document);
    const served = dlcHeader.innerHTML;

    mountForTest(
      <IndividualProgress headers={[dlcHeader]} groups={[nothingWon(baseHeader())]} />,
      document.createElement('div')
    );

    expect(dlcHeader.innerHTML).toBe(served);
  });

  test('should give each header its own text back when unmounted', () => {
    const header = baseHeader();
    const served = header.innerHTML;

    const root = mountForTest(
      <IndividualProgress headers={[header]} groups={[nothingWon(header)]} />,
      document.createElement('div')
    );
    root.unmount();

    expect(header.innerHTML).toBe(served);
  });
});
