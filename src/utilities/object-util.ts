export const getValue = <T>(object: object, path: string, defaultValue: T): T =>
  path.split('.').reduce((o, p) => (o ? o[p] : defaultValue), object);

export const setValue = (object: object, path: string, value: unknown) =>
  path.split('.').reduce((o, p, i) => (o[p] = path.split('.').length === ++i ? value : o[p] || {}), object);
