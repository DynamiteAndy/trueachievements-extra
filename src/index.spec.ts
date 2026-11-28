// The script's entry runs as it's imported, so each test resets the modules and imports it again, with every task it
// starts mocked: which tasks run where, that they all start at once (maintenance first), and that one failing doesn't
// stop the others.

const tasks = vi.hoisted(() => ({
  readGuidePage: vi.fn(),
  isGuideSite: vi.fn(),
  maintenance: vi.fn(),
  forgetLastGamer: vi.fn(),
  claimPage: vi.fn(),
  isDevScript: vi.fn(),
  warnDevStoodDown: vi.fn(),
  toast: vi.fn(),
  stylesheet: vi.fn(),
  settingsMenu: vi.fn(),
  allPages: vi.fn(),
  staffWalkthrough: vi.fn(),
  forum: vi.fn(),
  news: vi.fn(),
  game: vi.fn(),
  gamesList: vi.fn(),
  gamer: vi.fn()
}));

vi.mock('./maintenance', () => ({ maintenance: tasks.maintenance, forgetLastGamer: tasks.forgetLastGamer }));

vi.mock('./claim-page', () => ({
  claimPage: tasks.claimPage,
  isDevScript: tasks.isDevScript,
  warnDevStoodDown: tasks.warnDevStoodDown
}));

vi.mock('@ta-x-ui', () => ({ toast: tasks.toast, stylesheet: tasks.stylesheet }));

vi.mock('@ta-x-features', () => ({
  settingsMenu: tasks.settingsMenu,
  allPages: tasks.allPages,
  staffWalkthrough: tasks.staffWalkthrough,
  forum: tasks.forum,
  news: tasks.news,
  game: tasks.game,
  gamesList: tasks.gamesList,
  gamer: tasks.gamer,
  readGuidePage: tasks.readGuidePage,
  isGuideSite: tasks.isGuideSite
}));

const trueAchievementsTasks = [
  'maintenance',
  'toast',
  'stylesheet',
  'settingsMenu',
  'allPages',
  'staffWalkthrough',
  'forum',
  'news',
  'game',
  'gamesList',
  'gamer'
] as const;

const start = async (onGuideSite: boolean): Promise<void> => {
  tasks.isGuideSite.mockReturnValue(onGuideSite);
  vi.resetModules();
  await import('.');
};

describe('index', () => {
  beforeEach(() => {
    Object.values(tasks).forEach((task) => task.mockReset());
    // The same gamer as last time: nothing to forget
    tasks.forgetLastGamer.mockReturnValue(null);
    // The only copy of the script on the page
    tasks.claimPage.mockReturnValue(true);
  });

  // Another copy of the script started first on the page (the dev script and the two release scripts can all be enabled)
  test.each([
    { site: 'TrueAchievements', onGuideSite: false, dev: false, warns: false },
    { site: 'a guide site', onGuideSite: true, dev: false, warns: false },
    { site: 'TrueAchievements', onGuideSite: false, dev: true, warns: true },
    { site: 'a guide site', onGuideSite: true, dev: true, warns: false }
  ])(
    'on $site, starts nothing when another copy runs, the dev script ($dev) warning on TrueAchievements only',
    async ({ onGuideSite, dev, warns }) => {
      tasks.claimPage.mockReturnValue(false);
      tasks.isDevScript.mockReturnValue(dev);

      await start(onGuideSite);

      [...trueAchievementsTasks, 'forgetLastGamer', 'readGuidePage'].forEach((name) =>
        expect(tasks[name as keyof typeof tasks], name).not.toHaveBeenCalled()
      );
      expect(tasks.warnDevStoodDown).toHaveBeenCalledTimes(warns ? 1 : 0);
    }
  );

  test('on a guide site, only reads the guide page', async () => {
    await start(true);

    await vi.waitFor(() => expect(tasks.readGuidePage).toHaveBeenCalledExactlyOnceWith());
    trueAchievementsTasks.forEach((name) => expect(tasks[name], name).not.toHaveBeenCalled());
  });

  test('on TrueAchievements, starts every task once, with no arguments, all before any of them finishes', async () => {
    // None of them ever finishes, so each must start without waiting for another
    trueAchievementsTasks.forEach((name) => tasks[name].mockReturnValue(new Promise(() => {})));

    await start(false);

    trueAchievementsTasks.forEach((name) => expect(tasks[name], name).toHaveBeenCalledExactlyOnceWith());
    expect(tasks.readGuidePage).not.toHaveBeenCalled();
  });

  // Its migrations are synchronous, so they're done before any feature reads storage
  test('on TrueAchievements, starts maintenance first', async () => {
    await start(false);

    const [first] = trueAchievementsTasks.toSorted(
      (a, b) => tasks[a].mock.invocationCallOrder[0] - tasks[b].mock.invocationCallOrder[0]
    );
    expect(first).toBe('maintenance');
  });

  // Another gamer signed in: the last one's cached pages go before anything could read one
  test('on TrueAchievements, starts nothing until the last gamer is forgotten, then everything', async () => {
    let forgotten = (): void => undefined;
    tasks.forgetLastGamer.mockReturnValue(
      new Promise<void>((resolve) => {
        forgotten = resolve;
      })
    );

    await start(false);
    trueAchievementsTasks.forEach((name) => expect(tasks[name], name).not.toHaveBeenCalled());

    forgotten();

    await vi.waitFor(() =>
      trueAchievementsTasks.forEach((name) => expect(tasks[name], name).toHaveBeenCalledExactlyOnceWith())
    );
  });

  // The first task, so a start that stopped at a failure would leave every other task unstarted
  test('on TrueAchievements, still starts the rest when maintenance fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    tasks.maintenance.mockImplementation(() => {
      throw new Error('maintenance failed');
    });

    await start(false);

    await vi.waitFor(() =>
      trueAchievementsTasks.forEach((name) => expect(tasks[name], name).toHaveBeenCalledExactlyOnceWith())
    );
  });
});
