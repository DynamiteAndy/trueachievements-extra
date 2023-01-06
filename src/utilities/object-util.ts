export const getValue = <T>(object: any, path: string, defaultValue: T): T => path
  .split('.')
  .reduce((o, p) => o ? o[p] : defaultValue, object);

export const setValue = (object: any, path: string, value: any) => path
  .split('.')
  .reduce((o,p,i) => o[p] = path.split('.').length === ++i ? value : o[p] || {}, object);
  