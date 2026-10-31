export const toInt = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string') {
    const parsedValue = Number.parseInt(value.replace(/,/g, ''), 10);

    return !Number.isNaN(parsedValue) ? parsedValue : null;
  }

  return value;
};

// Joins class names, leaving out empty ones
export const classNames = (...names: (string | false | null | undefined)[]): string => names.filter(Boolean).join(' ');
