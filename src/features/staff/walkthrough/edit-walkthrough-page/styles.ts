export default {
  improvedImageSelector: 'ta-x-image-selector',
  improvedImageSelectorContainer: 'ta-x-image-selector-container',
  improvedImageSelectorImageTitle: 'ta-x-image-selector-title',
  stickyTinymceToolbar: 'ta-x-sticky-toolbar',
  jsThemeToggle: 'js-ta-x-theme-toggle',
  themeToggle: 'ta-x-theme-toggle',
  themeToggleLight: 'ta-x-theme-toggle-light',
  themeToggleDark: 'ta-x-theme-toggle-dark',
  jsSourceCodeButton: 'js-ta-x-source-code-button',
  sourceCodeButton: 'ta-x-source-code-button',
  tinymceGroup: 'ta-x-tinymce-group',
  // Text color and Background color's panels: the picker, its field, and its last swatch, No color
  textColorPicker: 'ta-x-text-color-picker',
  textColorField: 'ta-x-text-color-field',
  textColorNoColor: 'ta-x-text-color-no-color',
  // The sticky toolbar's CSS custom property (where TinyMCE's floating menus open; its own are stickUnderHeader's)
  variables: {
    stickyTinymceToolbarFloatingMenu: '--ta-x-sticky-toolbar-floating-menu'
  }
} as const;
