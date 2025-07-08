export const isHandlebarsOptions = (val: unknown): val is Handlebars.HelperOptions =>
  typeof val === 'object' && val !== null && 'hash' in val;