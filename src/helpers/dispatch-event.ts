export default (eventType: string, element: HTMLElement, opts?: EventInit & { detail: string }) => {
  const eventOpts = Object.assign(
    {
      bubbles: true,
      cancelable: eventType === 'click',
      detail: null
    },
    opts
  );

  if (eventOpts.detail) {
    if (typeof CustomEvent === 'function') {
      element.dispatchEvent(new CustomEvent(eventType, eventOpts));
    } else {
      const event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventType, eventOpts.bubbles, eventOpts.cancelable, eventOpts.detail);
      element.dispatchEvent(event);
    }
  } else {
    if (typeof Event === 'function') {
      element.dispatchEvent(new Event(eventType, eventOpts));
    } else {
      const event = document.createEvent('Event');
      event.initEvent(eventType, eventOpts.bubbles, eventOpts.cancelable);
      element.dispatchEvent(event);
    }
  }
};
