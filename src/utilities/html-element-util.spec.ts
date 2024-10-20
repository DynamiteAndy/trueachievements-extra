import each from 'jest-each';
import { setHtml } from '@ta-x-jest';
import {
  classListContains,
  waitForElement,
  waitForElements,
  removeAllChildren,
  waitForImages
} from './html-element-util';

describe('classListContains', () => {
  each([
    { input: 'test-class-a', expected: true },
    { input: 'test-class-b', expected: true },
    { input: ['test-class-a'], expected: true },
    { input: ['test-class-a', 'test-class-b'], expected: true },
    { input: ['test-class-a', 'test-class-d'], expected: true },
    { input: 'test-class-d', expected: false },
    { input: ['test-class-d'], expected: false }
  ]).test.concurrent('should return if $input is contained in classList', ({ input, expected }) => {
    setHtml('@ta-x-jest-views/test-classes.html');
    expect(classListContains(document.body, input)).toEqual(expected);
  });
});

describe('waitForElement', () => {
  it('should return null if no element is provided', async () => {
    const element = await waitForElement('body', null);

    expect(element).toBe(null);
  });

  it('should return element if element is found immediately', async () => {
    setHtml('@ta-x-jest-views/empty.html');
    const element = await waitForElement('body');

    expect(element).not.toBe(null);
  });

  it('should return null if element is not found after timeout', async () => {
    setHtml('@ta-x-jest-views/empty.html');
    const element = await waitForElement('.does-not-exist', undefined, 250);

    expect(element).toBe(null);
  });

  it('should return element if found after a mutation', async () => {
    setHtml('@ta-x-jest-views/empty.html');

    setTimeout(() => {
      const elementToObserve = document.createElement('div');
      elementToObserve.className = 'should-trigger-mutation';
      document.body.appendChild(elementToObserve);
    }, 1000);

    const element = await waitForElement('.should-trigger-mutation', document.body);

    expect(element).not.toBe(null);
  });
});

describe('waitForElements', () => {
  it('should return null if no element is provided', async () => {
    const elements = await waitForElements('body', null);

    expect(elements).toBe(null);
  });

  it('should return elements if elements are found immediately', async () => {
    setHtml('@ta-x-jest-views/empty.html');
    const elements = await waitForElements('body');

    expect(elements).not.toBe(null);
    expect(elements.length).toBe(1);
  });

  it('should return null if elements are not found after timeout', async () => {
    setHtml('@ta-x-jest-views/empty.html');
    const elements = await waitForElements('.does-not-exist', undefined, 250);

    expect(elements).toBe(null);
  });

  it('should return elements if found after a mutation', async () => {
    setHtml('@ta-x-jest-views/empty.html');

    setTimeout(() => {
      const parentElement = document.createElement('div');

      for (let i = 1; i <= 3; i++) {
        const childElement = document.createElement('div');
        childElement.className = `should-trigger-mutation`;
        parentElement.appendChild(childElement);
      }

      document.body.appendChild(parentElement);
    }, 1000);

    const elements = await waitForElements('.should-trigger-mutation', document.body);

    expect(elements).not.toBe(null);
    expect(elements.length).toBe(3);
  });
});

describe('removeAllChildren', () => {
  it('should remove all child elements', () => {
    setHtml('@ta-x-jest-views/empty.html');

    for (let i = 1; i <= 3; i++) {
      const childElement = document.createElement('div');
      childElement.className = `should-trigger-mutation`;
      document.body.appendChild(childElement);
    }

    removeAllChildren(document.body);

    expect(document.body.children.length).toBe(0);
  });
});

describe('waitForImages', () => {
  it('should resolve immediately if no images are present', async () => {
    setHtml('@ta-x-jest-views/empty.html');

    const el = document.createElement('div');
    document.body.appendChild(el);

    const promise = waitForImages(el);
    await expect(promise).resolves.toBeUndefined();
  });

  it('should resolve after all images are loaded', async () => {
    setHtml('@ta-x-jest-views/empty.html');

    const el = document.createElement('div');
    const imageSources = ['', 'image.jpg', 'load-image.jpg'];

    imageSources.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      el.appendChild(img);
    });

    document.body.appendChild(el);

    const promise = waitForImages(el);

    await expect(promise).resolves.toBeUndefined();
  });

  it('should resolve even if some images fail to load', async () => {
    setHtml('@ta-x-jest-views/empty.html');

    const el = document.createElement('div');
    const imageSources = ['', 'image.jpg', 'load-image.jpg', 'error-image.jpg'];

    imageSources.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      el.appendChild(img);
    });

    document.body.appendChild(el);

    const promise = waitForImages(el);

    await expect(promise).resolves.toBeUndefined();
  });
});
