import content from '../../src/features/staff/walkthrough/edit-walkthrough-page/tinymce/charcoal/content.scss';
import skin from '../../src/features/staff/walkthrough/edit-walkthrough-page/tinymce/charcoal/skin.scss';

// The test plugin compiles a stylesheet import to its CSS, as the build's loaders do. Vite's and Vitest's own CSS steps
// would make it an empty string, which a spec comparing what was added with the import would pass on
describe('test/plugins/web', () => {
  test.each([
    { name: 'the dark skin', css: skin, selector: '.mce-' },
    { name: "the dark editor's content", css: content, selector: 'body' }
  ])('should give $name as its compiled CSS', ({ css, selector }) => {
    expect(css).toContain(selector);
    // Compressed, as the build has it
    expect(css).not.toContain('\n  ');
  });
});
