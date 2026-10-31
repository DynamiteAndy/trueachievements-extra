import { createMetadata } from '../../build/metadata.ts';

// unsafeWindow is banned (lint stops it in code: no-restricted-globals / no-restricted-properties in .oxlintrc.json).
// The one exception is the Preact DevTools hook in dev builds, whose metadata adds the grant itself. The release
// metadata must never grant it.
describe('userscript grants', () => {
  test.each(['prod', 'prod-min'] as const)('the %s userscript never grants unsafeWindow', (variant) => {
    expect(createMetadata(variant).grant).not.toContain('unsafeWindow');
  });

  // Each build's metadata is its own object, so the dev build's grant never reaches a release built after it
  test('the dev metadata adds the grant to its own copy only', () => {
    expect(createMetadata('dev').grant).toContain('unsafeWindow');
    expect(createMetadata('prod').grant).not.toContain('unsafeWindow');
  });
});
