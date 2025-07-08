import { getValue, setValue } from './object-util';

describe('getValue', () => {
  it('should return value at a simple path', () => {
    const obj = { a: { b: 42 } };
    const result = getValue(obj, 'a.b', 0);
    expect(result).toBe(42);
  });

  it('should return default value if path is missing', () => {
    const obj = { a: { b: 42 } };
    const result = getValue(obj, 'a.c', 'default');
    expect(result).toBe('default');
  });

  it('should return value at root level', () => {
    const obj = { a: 100 };
    const result = getValue(obj, 'a', 0);
    expect(result).toBe(100);
  });

  it('should handle nested objects correctly', () => {
    const obj = { a: { b: { c: 'deep' } } };
    const result = getValue(obj, 'a.b.c', '');
    expect(result).toBe('deep');
  });

  it('should return default when encountering non-object in path', () => {
    const obj = { a: { b: null } };
    const result = getValue(obj, 'a.b.c', 'fallback');
    expect(result).toBe('fallback');
  });
});

describe('getValue - security', () => {
  it('should not traverse into __proto__', () => {
    const obj = JSON.parse('{"__proto__": {"polluted": true}}');
    const result = getValue(obj, '__proto__.polluted', 'safe');
    expect(result).toBe('safe');
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('should return default for constructor.prototype path', () => {
    const obj = {};
    const result = getValue(obj, 'constructor.prototype.polluted', 'safe');
    expect(result).toBe('safe');
  });

  it('should return default for empty path', () => {
    const obj = { a: 1 };
    const result = getValue(obj, '', 'default');
    expect(result).toBe('default');
  });
});

describe('setValue', () => {
  it('should set a value at a simple path', () => {
    const obj = {};
    setValue(obj, 'a.b', 123);
    expect(obj).toEqual({ a: { b: 123 } });
  });

  it('should overwrite existing value', () => {
    const obj = { a: { b: 10 } };
    setValue(obj, 'a.b', 99);
    expect(obj.a.b).toBe(99);
  });

  it('should create nested structure if it does not exist', () => {
    const obj: Record<string, unknown> = {};
    setValue(obj, 'x.y.z', true);
    expect(obj).toEqual({ x: { y: { z: true } } });
  });

  it('should handle setting value at root level', () => {
    const obj: Record<string, unknown> = {};
    setValue(obj, 'a', 'hello');
    expect(obj).toEqual({ a: 'hello' });
  });

  it('should not throw on partially existing path', () => {
    const obj = { a: {} };
    setValue(obj, 'a.b.c', 'nested');
    expect(obj).toEqual({ a: { b: { c: 'nested' } } });
  });
});

describe('setValue - security', () => {
  it('should not pollute Object.prototype via __proto__', () => {
    const obj: Record<string, unknown> = {};
    setValue(obj, '__proto__.polluted', true);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('should not pollute Object.prototype via constructor.prototype', () => {
    const obj: Record<string, unknown> = {};
    setValue(obj, 'constructor.prototype.polluted', true);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('should no-op on empty path without throwing', () => {
    const obj: Record<string, unknown> = { a: 1 };
    expect(() => setValue(obj, '', 'value')).not.toThrow();
    expect(obj).toEqual({ a: 1 });
  });
});