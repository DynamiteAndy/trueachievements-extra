import { find, required, setHtml, tick, withoutBody } from '@ta-x-test';
import { act } from 'preact/test-utils';

import { toast } from './add-toast';
import styles from './styles';
import { showToast } from './toast-message';

describe('ui/toast/add-toast', () => {
  beforeEach(() => {
    setHtml('@ta-x-test-views/empty.html');
  });

  test('should wait for the page to have a body, then add the toast to it', async () => {
    const addBody = withoutBody();

    const adding = toast();
    await tick();
    const body = addBody();
    onTestFinished(await adding);

    expect(body.querySelectorAll(`.${styles.toast}`)).toHaveLength(1);
  });

  test('should add the toast at the end of the body', async () => {
    onTestFinished(await toast());

    expect(required(document.body.lastElementChild)).toHaveExactClasses([
      'jq-toast-wrap',
      'bottom-right',
      styles.toast
    ]);
  });

  test('should add a working toast', async () => {
    await act(async () => {
      onTestFinished(await toast());
    });

    await act(() => showToast({ text: 'Autosave successful.', type: 'success' }));

    expect(find(`.${styles.toast} .jq-toast-heading`).textContent).toBe('Autosave successful.');
  });
});
