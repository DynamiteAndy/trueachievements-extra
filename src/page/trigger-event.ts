// Fires an event on an element as the site's own controls would: bubbling, so the site's handlers on a parent hear it
// (a select's `change`). Named apart from the DOM's own dispatchEvent, which it uses
export const triggerEvent = (element: HTMLElement, eventType: string): void => {
  element.dispatchEvent(new Event(eventType, { bubbles: true }));
};
