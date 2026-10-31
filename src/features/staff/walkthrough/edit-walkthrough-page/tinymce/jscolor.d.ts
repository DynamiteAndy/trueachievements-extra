// The package ships no types: only what append-color-picker.ts uses, a picker on a text input
declare module '@eastdesire/jscolor' {
  export interface JsColorOptions {
    zIndex?: number;
    // How the input shows the colour; 'auto' keeps the format it already has
    format?: 'auto' | 'any' | 'hex' | 'hexa' | 'rgb' | 'rgba';
    // Colours shown as swatch boxes under the picker, and how many go in a row
    palette?: string[];
    paletteCols?: number;
    // Where the picker is drawn (the page's body by default), in its flow
    container?: HTMLElement;
    // Whether the input must hold a colour, or may be empty
    required?: boolean;
    // Whether a click on the input shows the picker, and a click elsewhere hides it
    showOnClick?: boolean;
    hideOnLeave?: boolean;
    // The picker's own box: its fill, border and shadow
    backgroundColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    shadow?: boolean;
  }

  export default class JsColor {
    constructor(target: HTMLInputElement, options?: JsColorOptions);
    show(): void;
    // Hides whichever picker is showing
    static hide(this: void): void;
  }
}
