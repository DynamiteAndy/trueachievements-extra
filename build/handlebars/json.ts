import Handlebars from 'handlebars';
import { isHandlebarsOptions } from '../helpers/handlebars.ts';

export const parseProperty = (): void => {
  Handlebars.registerHelper(
    'parseProperty',
    (propName: string, propValue: unknown, optionsParam?: unknown) => {
      let rawValue = propValue;
      let options: Handlebars.HelperOptions | undefined;

      // Handle positional argument shifting when propValue is omitted in template
      if (isHandlebarsOptions(propValue)) {
        options = propValue;
        rawValue = undefined;
      } else if (isHandlebarsOptions(optionsParam)) {
        options = optionsParam;
      }

      if (!propName || typeof propName !== 'string' || !options?.data?.root) {
        return;
      }

      // If value is missing or not a string, assign directly
      if (typeof rawValue !== 'string') {
        options.data.root[propName] = rawValue ?? null;
        return;
      }

      try {
        const cleanedJson = rawValue.replace(/\r?\n|\r/g, '').trim();
        options.data.root[propName] = JSON.parse(cleanedJson);
      } catch (error) {
        console.warn(
          `[parseProperty] Failed to parse JSON for property "${propName}":`,
          error instanceof Error ? error.message : error
        );

        options.data.root[propName] = rawValue;
      }
    }
  );
};

export default { parseProperty };