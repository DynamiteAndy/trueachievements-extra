import { triggerEvent } from './trigger-event';

describe('triggerEvent', () => {
  // A parent's listener, as the site's handlers often are
  test('dispatches a plain event that bubbles to the parent', () => {
    const parent = document.createElement('div');
    const element = document.createElement('select');
    parent.append(element);
    const listener = vi.fn();
    parent.addEventListener('change', listener);

    triggerEvent(element, 'change');

    expect(listener).toHaveBeenCalledOnce();
    const [event] = listener.mock.calls[0] as [Event];
    expect([event.constructor.name, event.type, event.bubbles]).toEqual(['Event', 'change', true]);
    expect(event.target).toBe(element);
  });
});
