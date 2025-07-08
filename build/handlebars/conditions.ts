import Handlebars from 'handlebars';
import { isHandlebarsOptions } from '../helpers/handlebars.ts';

export const conditional = (): void => {
  Handlebars.registerHelper(
    'conditional',
    (objOrOptions?: unknown, optionsParam?: Handlebars.HelperOptions) => {
      let targetObj: Record<string, unknown> = {};

      if (isHandlebarsOptions(objOrOptions)) {
        targetObj = objOrOptions.hash ?? {};
      } else if (typeof objOrOptions === 'object' && objOrOptions !== null) {
        targetObj = { ...(objOrOptions as Record<string, unknown>) };

        if (optionsParam?.hash) {
          Object.assign(targetObj, optionsParam.hash);
        }
      }

      const out: string[] = [];

      for (const [prop, value] of Object.entries(targetObj)) {
        if (value !== false && value !== null && value !== undefined && value !== '') {
          out.push(prop);
        }
      }

      return out.join(' ');
    }
  );
};

export const ternary = (): void => {
  Handlebars.registerHelper(
    'ternary',
    (cond: unknown, truthy: unknown, falseyOrOptions?: unknown) => {
      const falsey = isHandlebarsOptions(falseyOrOptions) ? '' : falseyOrOptions;

      return cond ? truthy : (falsey ?? '');
    }
  );
};

export default { conditional, ternary };