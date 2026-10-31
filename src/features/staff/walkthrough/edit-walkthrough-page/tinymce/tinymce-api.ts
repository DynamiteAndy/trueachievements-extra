// The parts of the site's TinyMCE 4 that our page functions use (it has no types here). They run in the page, where
// `tinymce` and its editor are, and get them as arguments (`pageGlobal('tinymce')`,
// `pageGlobal('tinymce.activeEditor')`).

// A toolbar control: a button, or a group of them
interface TinyMCEControl {
  settings: { name?: string; format?: string };
  _title?: string;
  _items: TinyMCEControl[];
  _color?: string;
  _layoutRect: unknown;
  _lastRepaintRect: unknown;
  addClass: (className: string) => void;
  append: (control: TinyMCEControl) => void;
}

export interface TinyMCEControlEvent {
  control: TinyMCEControl;
  target: HTMLElement;
}

// A colour button: color sets the colour its button half applies and its swatch shows
export interface TinyMCEColorButton extends TinyMCEControl {
  color: (value: string) => void;
  hidePanel: () => void;
}

// A click in a colour button's panel, whose parent is the button
export interface TinyMCEPanelEvent {
  control: { parent: () => TinyMCEColorButton };
  target: HTMLElement;
}

interface TinyMCEMenuItem {
  image: string;
  classes: string;
  onclick: () => void;
}

export interface TinyMCEButtonSettings {
  type?: 'menubutton' | 'colorbutton';
  title?: string;
  tooltip?: string;
  image?: string;
  format?: string;
  menu?: TinyMCEMenuItem[];
  // `classes` are added to the panel's, each with TinyMCE's mce- in front
  panel?: {
    role: string;
    ariaRemember: boolean;
    classes?: string;
    html: string;
    onclick: (event: TinyMCEPanelEvent) => void;
  };
  onclick?: (event: TinyMCEControlEvent) => boolean | void;
}

interface TinyMCEDialog {
  data: { code: string };
  find: (selector: string) => { value: (value: string) => void };
}

// What a panel's find answers: TinyMCE's own Collection, indexed like a list and with filter, but not an array (no
// some, map, find…: a call to one throws in the page). A plain array fits it, as the specs pass
interface TinyMCECollection {
  readonly length: number;
  readonly [index: number]: TinyMCEControl | undefined;
  filter: (test: (control: TinyMCEControl) => boolean) => TinyMCECollection;
}

export interface TinyMCEEditor {
  buttons: Record<string, TinyMCEControl>;
  theme: { panel: { find: (selector: string) => TinyMCECollection } };
  undoManager: { transact: (action: () => void) => void };
  formatter: {
    apply: (format: string, variables: { value: string }) => void;
    remove: (format: string, variables: { value: null }, node: null, similar: boolean) => void;
  };
  selection: { setCursorLocation: () => void };
  windowManager: {
    open: (settings: {
      title: string;
      body: Record<string, unknown>;
      onSubmit: (dialog: TinyMCEDialog) => void;
    }) => TinyMCEDialog;
  };
  addButton: (name: string, settings: TinyMCEButtonSettings) => void;
  addCommand: (name: string, command: (format: string, value?: string) => void) => void;
  execCommand: (command: string, format: string, value?: string) => void;
  insertContent: (content: string) => void;
  getContent: (options: { source_view: boolean }) => string;
  setContent: (content: string) => void;
  getParam: (name: string, fallback: number) => number;
  focus: () => void;
  nodeChanged: () => void;
}

export interface TinyMCEGlobal {
  ui: { Factory: { create: (settings: { type: string; name: string; items: TinyMCEControl[] }) => TinyMCEControl } };
  DOM: {
    getViewPort: () => { h: number };
  };
}
