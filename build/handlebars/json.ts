import Handlebars from 'handlebars';

export const parseProperty = (): void => Handlebars.registerHelper('parseProperty', (propName: string, propValue: string, options) => {
  options.data.root[propName] = JSON.parse(propValue.replace(/\r?\n|\r/g, ''));
});

export default { parseProperty };