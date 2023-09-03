import Handlebars from 'handlebars';

export const createObject = (): void => Handlebars.registerHelper('object', ({ hash }) => hash);
export const createArray = (): void =>
  Handlebars.registerHelper('array', (args) => Array.from(args).slice(0, args.length - 1));

export const createString = (): void =>
  Handlebars.registerHelper('string', (args) => {
    let concatenated = '';

    for (let i = 0; i < args.length - 1; i++) {
      concatenated += args[i];
    }

    return concatenated;
  });

export default { createObject, createArray, createString };
