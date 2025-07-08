import Handlebars from 'handlebars';

export const createObject = (): void => {
  Handlebars.registerHelper('object', (options?: Handlebars.HelperOptions) => {
    return options?.hash ? { ...options.hash } : {};
  });
};

export const createArray = (): void => {
  Handlebars.registerHelper('array', (...args: unknown[]) => {
    return args.slice(0, -1);
  });
};

export const createString = (): void => {
  Handlebars.registerHelper('string', (...args: unknown[]) => {
    return args.slice(0, -1).join('');
  });
};

export default { createObject, createArray, createString };