import { pageGlobal, pageScript } from '@ta-x-page';
import { controllerButtons } from '@ta-x-site';
import { find, required, setHtml, useFakeTimers } from '@ta-x-test';

import { addControllerButtons, addControllerButtonsButton } from './add-controller-buttons';
import { appendButtons } from './append-buttons';
import { addInsertXboxImageButton } from './insert-xbox-images';

// The two scripts for buttons the site usually adds itself (in its own toolbar groups, not ours)
describe.each([
  {
    name: 'add-controller-buttons',
    add: addControllerButtonsButton,
    label: 'Controller Buttons',
    script: 'ta-x-controller-buttons-command'
  },
  {
    name: 'insert-xbox-images',
    add: addInsertXboxImageButton,
    label: 'Insert Xbox captures',
    script: 'ta-x-insert-xbox-image-command'
  }
])('staff/walkthrough/edit-walkthrough-page/tinymce/$name', ({ add, label, script }) => {
  const injected = (): boolean => document.getElementById(script) !== null;

  beforeEach(() => {
    setHtml('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-site-buttons.html');
  });

  test('should skip when the site has added the button itself', async () => {
    await add();

    expect(injected()).toBe(false);
  });

  test("should add it when the site hasn't, without waiting for our TA-X group (it goes in the site's groups)", async () => {
    required(find(`[aria-label="${label}"]`).closest('.mce-btn-group')).remove();
    useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    // The fixture has no TA-X group, so waiting for it would only end with its timeout
    const adding = add();

    // It gives the site a moment to draw its button first
    await vi.advanceTimersByTimeAsync(249);
    expect(injected()).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await adding;
    expect(injected()).toBe(true);
  });
});

describe('staff/walkthrough/edit-walkthrough-page/tinymce/add-controller-buttons', () => {
  test("should show the menu's pictures from the site's image host, as the site's own menu does", async () => {
    setHtml('@ta-x-test-views/staff-edit-walkthrough-page/tinymce-site-buttons.html');
    required(find('[aria-label="Controller Buttons"]').closest('.mce-btn-group')).remove();
    useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

    const adding = addControllerButtonsButton();
    await vi.advanceTimersByTimeAsync(250);
    await adding;

    expect(find('#ta-x-controller-buttons-command').textContent).toBe(
      pageScript(
        addControllerButtons,
        pageGlobal('tinymce.activeEditor'),
        appendButtons,
        controllerButtons,
        '//static.trueachievements.com/images/controllerbuttons/Xbox One/'
      )
    );
  });
});
