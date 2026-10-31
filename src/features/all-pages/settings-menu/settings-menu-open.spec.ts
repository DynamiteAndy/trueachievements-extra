describe('all-pages/settings-menu/settings-menu-open', () => {
  // The specs' setup closes the menu before every test (test/mocks/page.ts), so the module is loaded afresh to see
  // what a page starts with
  test('should start closed', async () => {
    vi.resetModules();
    const { settingsMenuOpen } = await import('./settings-menu-open');

    expect(settingsMenuOpen.value).toBe(false);
  });
});
