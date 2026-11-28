import { isPreviewStatus, previewStatusesText } from './preview-statuses';

describe('staff/walkthrough/walkthrough-preview/preview-statuses', () => {
  test.each([
    ['In progress', true],
    ['Published', true],
    // The site's others (its status filter)
    ['New', false],
    ['Merged', false],
    ['New owner required', false],
    ['in progress', false]
  ])('should say whether "%s" is covered: %s', (status, covered) => {
    expect(isPreviewStatus(status)).toBe(covered);
  });

  test('should name them for the panels, quoted and joined', () => {
    expect(previewStatusesText).toBe('"In progress", "Ready for review", "Ready for publish" and "Published"');
  });
});
