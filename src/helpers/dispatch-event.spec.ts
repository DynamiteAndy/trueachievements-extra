import { setHtml } from '@ta-x-test';
import dispatchEvent from './dispatch-event';

describe('dispatchEvent', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    await setHtml('@ta-x-test-views/empty.html');

    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  test('dispatches a custom event with detail', () => {
    const listener = vi.fn();

    element.addEventListener('custom-event', listener);
    dispatchEvent(element, 'custom-event', { detail: 'detail information' });

    expect(listener).toHaveBeenCalled();
    expect(listener.mock.calls[0][0].type).toBe('custom-event');
    expect(listener.mock.calls[0][0].detail).toBe('detail information');
  });

  test('dispatches a custom event when CustomEvent is not a function', () => {
    const originalCustomEvent = global.CustomEvent;
    delete global.CustomEvent;

    const listener = vi.fn();

    element.addEventListener('custom-event', listener);
    dispatchEvent(element, 'custom-event', { detail: 'detail information' });

    expect(listener).toHaveBeenCalled();
    expect(listener.mock.calls[0][0].type).toBe('custom-event');
    expect(listener.mock.calls[0][0].detail).toBe('detail information');

    global.CustomEvent = originalCustomEvent;
  });

  test('dispatches a click event', () => {
    const listener = vi.fn();

    element.addEventListener('click', listener);
    dispatchEvent(element, 'click');

    expect(listener).toHaveBeenCalled();
    expect(listener.mock.calls[0][0].type).toBe('click');
  });

  test('dispatches a click event when Event is not a function', () => {
    const originalEvent = global.Event;
    delete global.Event;

    const listener = vi.fn();

    element.addEventListener('click', listener);
    dispatchEvent(element, 'click');

    expect(listener).toHaveBeenCalled();
    expect(listener.mock.calls[0][0].type).toBe('click');

    global.Event = originalEvent;
  });
});
