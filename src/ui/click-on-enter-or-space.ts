import type { KeyboardEventHandler } from 'preact';

// A key pressed with Alt, Ctrl or Cmd belongs to the browser or the system (Alt+Left is back), never to our controls
export const pressedWithModifier = (event: KeyboardEvent): boolean => event.altKey || event.ctrlKey || event.metaKey;

// For a control that keeps the site's element (a span, li or div its CSS styles) as a role="button" or role="tab": it
// takes Enter and Space as a real button does, a click, with Space not scrolling the page
export const clickOnEnterOrSpace: KeyboardEventHandler<HTMLElement> = (event) => {
  if ((event.key === 'Enter' || event.key === ' ') && !pressedWithModifier(event)) {
    event.preventDefault();
    event.currentTarget.click();
  }
};
