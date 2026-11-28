import { find } from '@ta-x-test';

import { addClasses } from './add-classes';

describe('addClasses', () => {
  const element = (markup: string): Element => {
    document.body.innerHTML = markup;
    return find('body > *');
  };

  test('should add the classes it is given', () => {
    const link = element('<a class="site"></a>');

    addClasses(link, 'ours', 'also-ours');

    expect(link.getAttribute('class')).toBe('site ours also-ours');
  });

  test('should take off only the classes it added', () => {
    const link = element('<a class="button"></a>');

    const giveBack = addClasses(link, 'button', 'ours');
    giveBack();

    expect(link.getAttribute('class')).toBe('button');
  });

  test('should leave no empty class attribute on an element that had none', () => {
    const main = element('<main></main>');

    const giveBack = addClasses(main, 'ours', 'ours');
    giveBack();

    expect(main.hasAttribute('class')).toBe(false);
  });

  test('should keep an empty class attribute the element had', () => {
    const main = element('<main class=""></main>');

    const giveBack = addClasses(main, 'ours');
    giveBack();

    expect(main.getAttribute('class')).toBe('');
  });

  test('should keep a class the site added meanwhile', () => {
    const main = element('<main></main>');

    const giveBack = addClasses(main, 'ours');
    main.classList.add('site');
    giveBack();

    expect(main.getAttribute('class')).toBe('site');
  });

  test('should give back only once', () => {
    const main = element('<main></main>');

    const giveBack = addClasses(main, 'ours');
    giveBack();
    main.classList.add('ours');
    giveBack();

    expect(main.getAttribute('class')).toBe('ours');
  });
});
