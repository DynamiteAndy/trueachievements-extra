// Which post back brought the manage page or walkthrough page back, so the cached copies of a walkthrough are dropped
// only when it changed. The site's Postback(command, argument, confirmDelete) fills hidden fields and calls the form's
// submit(), which fires no submit event and leaves nothing the next page can read, so the command is read from the
// clicked control's own Postback call as the click (or change) happens, and kept in this tab until the page comes back
const key = 'ta-x-walkthrough-postback';

export interface PostbackCommand {
  command: string;
  // Posted with the site's "Are you sure that you want to delete this record?"
  deletes: boolean;
}

const postbackCall = /Postback\(\s*'([^']*)'(?:\s*,\s*'[^']*'(?:\s*,\s*(true|!0))?)?/;

// What posts the page back on each event: a click runs a link's onclick or href, a change a select's onchange (so a
// select opened and left as it was records nothing)
const postingAttributes = { click: ['onclick', 'href'], change: ['onchange'] } as const;

const commandOf = (control: Element, attributes: readonly string[]): PostbackCommand | null => {
  const code = attributes.map((name) => control.getAttribute(name) ?? '').join(' ');
  const [, command, deletes] = postbackCall.exec(code) ?? [];

  return command === undefined ? null : { command, deletes: deletes !== undefined };
};

const record = (event: Event): void => {
  const attributes = postingAttributes[event.type as keyof typeof postingAttributes];
  const control =
    event.target instanceof Element ? event.target.closest(attributes.map((name) => `[${name}]`).join(', ')) : null;
  const command = control ? commandOf(control, attributes) : null;

  if (command) {
    sessionStorage.setItem(key, JSON.stringify(command));
  }
};

// Listens for the page's controls posting it back, ahead of the site's own handlers. Hands back what stops listening
export const recordPostbackCommands = (): (() => void) => {
  const listening = new AbortController();
  document.addEventListener('click', record, { capture: true, signal: listening.signal });
  document.addEventListener('change', record, { capture: true, signal: listening.signal });

  return () => listening.abort();
};

// The command that posted the page back, once: read and forgotten, so a later visit doesn't reuse it. Null when none
// was recorded (a reload, or a control this doesn't read)
export const takePostbackCommand = (): PostbackCommand | null => {
  const recorded = sessionStorage.getItem(key);
  sessionStorage.removeItem(key);

  try {
    return recorded ? (JSON.parse(recorded) as PostbackCommand) : null;
  } catch {
    return null;
  }
};

// Commands read live from the manage page and walkthrough page that change nothing the preview reads: searching,
// filtering, sorting a list (its "…H" header links), picking a row (its "…E" links), and opening another view or page.
// Clear Cache isn't one: it's asked for when the site's copy is out of date
const viewOnly = new Set([
  'btnAddPage',
  'btnBackToWalkthrough_click',
  'btnCancel_click',
  'btnEditPage2_click',
  'btnEditPage_click',
  'btnLogOut_click',
  'btnPreview',
  'btnSearchWalkthrough_click',
  'btnUnlockWalkthroughPage2_click',
  'btnUnlockWalkthroughPage_click',
  'btnViewContent',
  'btnViewWalkthrough',
  'chkBeingImprovedFilter',
  'ddlPortStatus',
  'ddlStatusFilter',
  'sddWalkthroughPageID',
  'txtSearch'
]);
const listSortOrPick = /^lst\w+[EH]$/;

// Whether a post back may have changed the walkthrough. A save, a delete, a command not known to change nothing (an In
// progress walkthrough's controls weren't seen), or none recorded (a reload) all count
export const changesWalkthrough = (postback: PostbackCommand | null): boolean =>
  !postback || postback.deletes || !(viewOnly.has(postback.command) || listSortOrPick.test(postback.command));
