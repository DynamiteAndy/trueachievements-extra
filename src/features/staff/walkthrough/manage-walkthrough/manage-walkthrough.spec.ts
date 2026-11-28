import * as taxLib from '@ta-x-lib';
import sheet from '@ta-x-scss/index.scss';
import { StaffRegex } from '@ta-x-site';
import { find, ids, neverFinds, outcome, required, setHtml, useFakeTimers } from '@ta-x-test';
import { rootClass } from '@ta-x-ui';

import { addMissingButtons } from './add-missing-buttons';
import { autoSelectFirst } from './auto-select-first';
import { changeToDefaultStatus } from './default-status';
import styles from './styles';

import manageWalkthrough from '.';

// Each has its own spec; here they record what the page looked like when they ran
vi.mock('./default-status', () => ({ changeToDefaultStatus: vi.fn(async () => false) }));
vi.mock('./auto-select-first', () => ({ autoSelectFirst: vi.fn(async () => undefined) }));

describe('staff/walkthrough/manage-walkthrough', () => {
  const container = (): HTMLElement | null => document.querySelector(`.${styles.manageWalkthroughContainer}`);
  // The batch's tasks each have their own spec, so it's stubbed: the page tweaks don't need their markup
  const stubBatch = (): ReturnType<typeof vi.spyOn> => vi.spyOn(taxLib, 'allConcurrently').mockResolvedValue([]);
  // Runs the feature, unmounting its controller (when it mounted one) when the test ends
  const run = async (): Promise<void> => {
    const unmount = await manageWalkthrough();
    if (unmount) {
      onTestFinished(unmount);
    }
  };
  // Its batch, exactly
  const batchTasks = [{ name: 'staff:walkthrough:manage-walkthrough:add-missing-buttons', task: addMissingButtons }];
  const onPage = (on: boolean): void => {
    vi.spyOn(StaffRegex.Walkthroughs.Test, 'manageWalkthroughUrl').mockReturnValue(on);
  };

  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-manage-walkthrough/walkthrough-selected.html');
  });

  test('should not run if not on the manage walkthrough page', async () => {
    onPage(false);
    const batch = stubBatch();

    await run();

    expect(container()).toBeNull();
    expect(changeToDefaultStatus).not.toHaveBeenCalled();
    expect(batch).not.toHaveBeenCalled();
  });

  test('should start exactly its batch, after the controller has mounted', async () => {
    onPage(true);
    let mountedFirst: boolean | undefined;
    const batch = stubBatch().mockImplementation(async () => {
      mountedFirst = container() !== null;
      return [];
    });

    await run();

    expect(batch).toHaveBeenCalledExactlyOnceWith('Manage Walkthrough', batchTasks);
    expect(mountedFirst).toBe(true);
  });

  // Its batch's timings mean something only if the batch it's in waits for this one to finish
  test('should resolve only once its batch has finished', async () => {
    useFakeTimers();
    onPage(true);
    const finishing = Promise.withResolvers<[]>();
    stubBatch().mockReturnValue(finishing.promise);

    const running = run();
    await vi.waitFor(() => expect(taxLib.allConcurrently).toHaveBeenCalledOnce());

    expect(await outcome(running)).toEqual({ settled: false });

    finishing.resolve([]);

    expect(await outcome(running)).toEqual({ settled: true, value: undefined });
  });

  // Picking the default status or the first walkthrough reloads the page's panels, so both come before the controller
  test('should pick the default status, then the first walkthrough, before the controller mounts', async () => {
    onPage(true);
    stubBatch();
    const steps: [string, boolean][] = [];
    vi.mocked(changeToDefaultStatus).mockImplementationOnce(async () => {
      steps.push(['default status', container() !== null]);
      return false;
    });
    vi.mocked(autoSelectFirst).mockImplementationOnce(async () => {
      steps.push(['select first', container() !== null]);
    });

    await run();

    expect(steps).toEqual([
      ['default status', false],
      ['select first', false]
    ]);
    expect(container()).not.toBeNull();
  });

  // Its post back replaces the page, and the next one picks from the filtered list
  test('should stop once the default status has posted the page back', async () => {
    onPage(true);
    const batch = stubBatch();
    vi.mocked(changeToDefaultStatus).mockResolvedValueOnce(true);

    await run();

    expect(autoSelectFirst).not.toHaveBeenCalled();
    expect(container()).toBeNull();
    expect(batch).not.toHaveBeenCalled();
  });

  test('should add the container once, straight after the walkthrough details', async () => {
    onPage(true);
    stubBatch();

    await run();

    expect(required(container()).tagName).toBe('DIV');
    expect(required(container())).toHaveExactClasses([styles.manageWalkthroughContainer]);
    expect(required(required(container()).previousElementSibling).id).toBe('chEditWalkthrough');
    expect(document.querySelectorAll(`.${styles.manageWalkthroughContainer}`)).toHaveLength(1);
  });

  test('should move the right sidebar panels into the container', async () => {
    onPage(true);
    stubBatch();

    await run();

    await vi.waitFor(() =>
      expect(ids(required(container()))).toEqual([
        'chWalkthroughAchievements',
        'chWalkthroughGames',
        'chWalkthroughGamers',
        'chWalkthroughOtherSiteLink'
      ])
    );
    expect(ids(find('#divWalkthroughHolder'))).toEqual([
      'chWalkthroughs',
      'chEditWalkthrough',
      styles.manageWalkthroughContainer
    ]);
  });

  // The page's panels aren't there (no walkthrough selected yet) or the site hasn't drawn them: no controller, but the
  // batch still starts, as add missing buttons checks the page for itself
  describe('without the panels to hold', () => {
    test.each([
      ['no walkthrough holder', () => neverFinds('#divWalkthroughHolder')],
      ['no walkthrough details', () => neverFinds('#chEditWalkthrough')],
      ['the site not drawing its panels', () => vi.spyOn(taxLib, 'until').mockResolvedValueOnce(false)]
    ])('should mount nothing with %s, and still start the rest of the batch', async (_, arrange) => {
      onPage(true);
      const batch = stubBatch();
      arrange();

      await run();

      expect(container()).toBeNull();
      expect(batch).toHaveBeenCalledExactlyOnceWith('Manage Walkthrough', batchTasks);
    });
  });

  // Its items move into the buttons row only with the controller, so without it the site's own button stays
  describe("the site's Action button", () => {
    const actionButtonShown = (): boolean => getComputedStyle(find('#btnWalkthrough')).display !== 'none';

    beforeEach(() => {
      const style = document.createElement('style');
      style.textContent = sheet;
      document.head.append(style);
      document.body.classList.add(rootClass, 'ta-x-staff');
      onTestFinished(() => {
        style.remove();
        document.body.classList.remove(rootClass, 'ta-x-staff');
      });
      onPage(true);
      stubBatch();
    });

    test('should be hidden once the controller has moved its items into the buttons row', async () => {
      await run();

      expect(actionButtonShown()).toBe(false);
    });

    test("should stay when the controller doesn't mount", async () => {
      vi.spyOn(taxLib, 'until').mockResolvedValueOnce(false);

      await run();

      expect(container()).toBeNull();
      expect(actionButtonShown()).toBe(true);
    });
  });
});
