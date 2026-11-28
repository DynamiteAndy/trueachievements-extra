import { click, find, mountForTest, pressKey, renderElement, required, tick } from '@ta-x-test';

import { hideClass } from '../../constants';
import styles from '../styles';

import { AskForm } from './AskForm';

describe('ui/ask-loader/AskForm', () => {
  const field = (form: Element) => find<HTMLInputElement>('input[type="text"]', form);
  const button = (form: Element) => find<HTMLInputElement>('input[type="submit"]', form);

  test('renders its text, a labelled field and a Save button', () => {
    const form = renderElement(<AskForm label="Walkthrough Id" info="Please enter the walkthrough id." />);

    expect([...form.classList]).toEqual([styles.askLoaderAsk]);
    expect(find(':scope > p', form).textContent).toBe('Please enter the walkthrough id.');
    expect(find('label', form).textContent).toBe('Walkthrough Id');
    expect(find('label', form).className).toBe('small');
    expect(field(form).id).not.toBe('');
    expect(find('label', form).getAttribute('for')).toBe(field(form).id);
    // The site's own field and button classes
    expect([field(form).type, field(form).className]).toEqual(['text', 'textbox cs-n']);
    expect([button(form).type, button(form).value, button(form).className]).toEqual(['submit', 'Save', 'button']);
    expect(button(form).hasAttribute('id')).toBe(false);
  });

  test('leaves out the text when it has none, and takes its own button text', () => {
    const form = renderElement(<AskForm label="XboxAchievements Url" buttonText="Add" />);

    expect(form.querySelector(':scope > p')).toBeNull();
    expect(button(form).value).toBe('Add');
  });

  test('hides with a class, keeping what was typed', () => {
    const root = mountForTest(<AskForm label="Walkthrough Id" />, document.body);
    const form = root.element;
    field(required(form)).value = '4138';

    root.render(<AskForm label="Walkthrough Id" hidden />);
    expect(required(form)).toHaveExactClasses([styles.askLoaderAsk, hideClass]);
    root.render(<AskForm label="Walkthrough Id" />);

    expect(root.element).toBe(form);
    expect(required(form)).toHaveExactClasses([styles.askLoaderAsk]);
    expect(field(required(form)).value).toBe('4138');
  });

  test('passes what was typed to onSubmit without submitting anything, keeping it unless told to clear', () => {
    const onSubmit = vi.fn();
    const form = mountForTest(<AskForm label="Walkthrough Id" onSubmit={onSubmit} />, document.body).element;
    field(required(form)).value = '4138';

    expect(click(button(required(form))).defaultPrevented).toBe(true);
    expect(onSubmit).toHaveBeenCalledExactlyOnceWith('4138');
    expect(field(required(form)).value).toBe('4138');
  });

  test('sends on Enter, without submitting the page, and leaves other keys to the field', () => {
    const onSubmit = vi.fn(() => true);
    const form = mountForTest(<AskForm label="Walkthrough Id" onSubmit={onSubmit} />, document.body).element;
    field(required(form)).value = '4138';
    const key = (name: string) => pressKey(field(required(form)), name);

    expect(key('a').defaultPrevented).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();

    expect(key('Enter').defaultPrevented).toBe(true);
    expect(onSubmit).toHaveBeenCalledExactlyOnceWith('4138');
    expect(field(required(form)).value).toBe('');
  });

  test('clears the field when onSubmit returns true', () => {
    const form = mountForTest(<AskForm label="Walkthrough Id" onSubmit={() => true} />, document.body).element;
    field(required(form)).value = '4138';

    click(button(required(form)));

    expect(field(required(form)).value).toBe('');
  });

  // A lookup that worked clears it, so the form is empty when it's opened again; one that didn't keeps it, to fix
  test.each([
    { settles: 'resolves true', result: () => Promise.resolve(true), value: '', outcome: 'clears it' },
    { settles: 'resolves false', result: () => Promise.resolve(false), value: '4138', outcome: 'keeps it' },
    { settles: 'rejects', result: () => Promise.reject(new Error('not found')), value: '4138', outcome: 'keeps it' }
  ])('clears the field only when the promise onSubmit returns $settles with true', async ({ result, value }) => {
    const form = mountForTest(<AskForm label="Walkthrough Id" onSubmit={result} />, document.body).element;
    field(required(form)).value = '4138';

    click(button(required(form)));
    await tick();

    expect(field(required(form)).value).toBe(value);
  });

  describe('with a Cancel', () => {
    test('puts Cancel after the main button, in a row of their own, and calls onCancel without submitting', () => {
      const onCancel = vi.fn();
      const onSubmit = vi.fn();
      const form = mountForTest(<AskForm label="Url" onSubmit={onSubmit} onCancel={onCancel} />, document.body).element;
      const buttons = find(`.${styles.askLoaderAskButtons}`, form);

      expect(
        [...buttons.children].map((input) => [(input as HTMLInputElement).type, (input as HTMLInputElement).value])
      ).toEqual([
        ['submit', 'Save'],
        ['button', 'Cancel']
      ]);
      expect(click(find<HTMLInputElement>('input[value="Cancel"]', buttons)).defaultPrevented).toBe(true);
      expect(onCancel).toHaveBeenCalledExactlyOnceWith();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    test('cancels on Escape in the field, keeping the key from the page (the settings menu closes on it)', () => {
      const onCancel = vi.fn();
      const page = vi.fn();
      document.addEventListener('keydown', page);
      onTestFinished(() => document.removeEventListener('keydown', page));
      const form = mountForTest(<AskForm label="Url" onCancel={onCancel} />, document.body).element;

      expect(pressKey(field(required(form)), 'Escape').defaultPrevented).toBe(true);
      expect(onCancel).toHaveBeenCalledExactlyOnceWith();
      expect(page).not.toHaveBeenCalled();
    });

    // So it's empty when the form is opened again
    test.each([
      { by: 'Cancel', cancel: (form: Element) => click(find('input[value="Cancel"]', form)) },
      { by: 'Escape', cancel: (form: Element) => pressKey(field(form), 'Escape') }
    ])('clears the field when cancelled by $by', ({ cancel }) => {
      const form = required(mountForTest(<AskForm label="Url" onCancel={() => undefined} />, document.body).element);
      field(form).value = 'https://www.trueachievements.com/game/X/walkthrough';

      cancel(form);

      expect(field(form).value).toBe('');
    });

    // Opened by + or the pencil, which go as it shows: the keyboard carries on in the field
    test('puts the focus in its field when shown, and leaves it where it is without onCancel', () => {
      const asked = required(mountForTest(<AskForm label="Url" onCancel={() => undefined} />, document.body).element);
      expect(document.activeElement).toBe(field(asked));

      const outside = document.body.appendChild(document.createElement('button'));
      outside.focus();
      mountForTest(<AskForm label="Url" />, document.body);
      expect(document.activeElement).toBe(outside);
    });

    test('has no Cancel, and leaves Escape alone, without onCancel', () => {
      const form = renderElement(<AskForm label="Url" />);

      expect(form.querySelector(`.${styles.askLoaderAskButtons}`)).toBeNull();
      expect(form.querySelector('input[value="Cancel"]')).toBeNull();
      expect(pressKey(field(form), 'Escape').defaultPrevented).toBe(false);
    });
  });
});
