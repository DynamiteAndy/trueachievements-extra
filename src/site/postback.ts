// What one of the site's `javascript:Postback('<command>', '<argument>')` links posts back (its argument quoted or not,
// e.g. Postback('lstWalkthroughIDE','4138') or Postback('btnEnterContest', 1170)), or null for anything else. Reads a
// link's href (where a browser may percent-encode the space after the comma) or its markup
export const parsePostback = (text: string): { command: string; argument: string } | null => {
  let source = text;
  try {
    source = decodeURIComponent(text);
  } catch {
    // Not encoded (a lone % in it): read as it is
  }

  const match = /Postback\(\s*'([^']*)'\s*(?:,\s*'?([^')]*?)'?\s*)?\)/.exec(source);

  return match ? { command: match[1], argument: match[2] ?? '' } : null;
};

// The body a site postback sends: the form's fields as the browser would submit them (text values only), then the
// postback's Command and Argument, last, in place of any form field of the same name
export const postbackBody = (
  form: HTMLFormElement,
  { command, argument }: { command: string; argument: string }
): URLSearchParams => {
  const body = new URLSearchParams();
  new FormData(form).forEach((value, key) => {
    if (typeof value === 'string') {
      body.append(key, value);
    }
  });
  body.delete('Command');
  body.delete('Argument');
  body.append('Command', command);
  body.append('Argument', argument);

  return body;
};
