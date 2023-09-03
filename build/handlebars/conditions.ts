import Handlebars from 'handlebars';

export const conditional = (): void =>
  Handlebars.registerHelper('conditional', (obj: unknown) => {
    const out = [];

    if (typeof obj === 'object' && obj !== null) {
      for (const prop in obj) {
        const value = obj[prop];

        if (value === false || value === null || value === undefined) {
          continue;
        }

        out.push(prop);
      }
    }

    return out.join(' ');
  });

export const ternary = (): void =>
  Handlebars.registerHelper('ternary', (cond: unknown, truthy: unknown, falsey: unknown) => (cond ? truthy : falsey));

export default { conditional, ternary };
