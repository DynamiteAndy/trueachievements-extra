import { changesWalkthrough, recordPostbackCommands, takePostbackCommand } from './postback-command';

describe('staff/walkthrough/walkthrough-preview/postback-command', () => {
  // The control as the site writes it, clicked (or changed) without the site's own handler running: the recorder
  // listens ahead of it, and this stops the event right after
  const control = (tag: string, attribute: string, code: string): HTMLElement => {
    const element = document.body.appendChild(document.createElement(tag));
    element.setAttribute(attribute, code);
    return element;
  };
  const fire = (element: Element, type: 'click' | 'change'): void => {
    document.addEventListener(type, (event) => event.stopImmediatePropagation(), { capture: true, once: true });
    element.dispatchEvent(new Event(type, { bubbles: true }));
  };

  test.each([
    ['an onclick', 'a', 'onclick', "Postback('btnSave_click');return false;", 'click'],
    ['a javascript: link', 'a', 'href', "javascript:Postback('lstWalkthroughIDE','3567')", 'click'],
    ['an onchange', 'select', 'onchange', "Postback('ddlStatusFilter');", 'change']
  ] as const)('should record the command of %s as it fires', (_kind, tag, attribute, code, type) => {
    const stop = recordPostbackCommands();
    fire(control(tag, attribute, code), type);
    stop();

    expect(takePostbackCommand()?.command).toBe(/Postback\('(\w+)'/.exec(code)?.[1]);
  });

  // Opening a select is a click; only picking from it posts the page back
  test('should record nothing when a select is clicked but left as it was', () => {
    const stop = recordPostbackCommands();
    fire(control('select', 'onchange', "Postback('ddlStatusFilter');"), 'click');
    stop();

    expect(takePostbackCommand()).toBeNull();
  });

  test('should record a delete, posted with the confirmation', () => {
    const stop = recordPostbackCommands();
    fire(control('a', 'onclick', "Postback('lstWalkthroughGamesD','12',true);return false;"), 'click');
    stop();

    expect(takePostbackCommand()).toEqual({ command: 'lstWalkthroughGamesD', deletes: true });
  });

  test('should record the control around what was clicked, and nothing for a control that posts nothing back', () => {
    const stop = recordPostbackCommands();
    const save = control('a', 'onclick', "Postback('btnSave_click');return false;");
    fire(save.appendChild(document.createElement('img')), 'click');
    expect(takePostbackCommand()?.command).toBe('btnSave_click');

    fire(control('a', 'href', '/staff/walkthrough/walkthroughpreview.aspx'), 'click');
    stop();

    expect(takePostbackCommand()).toBeNull();
  });

  test('should hand a command back once, and stop recording when told', () => {
    const stop = recordPostbackCommands();
    const save = control('a', 'onclick', "Postback('btnSave_click');return false;");
    fire(save, 'click');
    stop();

    expect(takePostbackCommand()?.command).toBe('btnSave_click');
    expect(takePostbackCommand()).toBeNull();
    fire(save, 'click');
    expect(takePostbackCommand()).toBeNull();
  });

  test.each([
    ['nothing recorded (a reload)', null, true],
    ['a save', { command: 'btnSave_click', deletes: false }, true],
    ['a delete', { command: 'lstWalkthroughGamesE', deletes: true }, true],
    ['a command it does not know', { command: 'btnAddGame', deletes: false }, true],
    ['Clear Cache', { command: 'btnClearCache', deletes: false }, true],
    ['picking a walkthrough', { command: 'lstWalkthroughIDE', deletes: false }, false],
    ['a list sort', { command: 'lstWalkthroughPagesH', deletes: false }, false],
    ['a filter', { command: 'ddlStatusFilter', deletes: false }, false],
    ['Add page (only the form)', { command: 'btnAddPage', deletes: false }, false],
    ["the walkthrough page's page picker", { command: 'sddWalkthroughPageID', deletes: false }, false]
  ])('should tell whether %s may have changed the walkthrough', (_kind, postback, changes) => {
    expect(changesWalkthrough(postback)).toBe(changes);
  });
});
