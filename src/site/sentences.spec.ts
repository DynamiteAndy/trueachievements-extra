import { SentencesRegex } from './sentences';

describe.each<{ name: string; check: (input: string) => unknown; cases: { input: string; expected: unknown }[] }>([
  {
    name: 'SentencesRegex.discussWalkthrough.test',
    check: (input: string) => SentencesRegex.discussWalkthrough.test(input),
    cases: [
      {
        input: 'Please use this thread to discuss the The Witcher 2: Assassins of Kings (EU Ver) walkthrough',
        expected: true
      },
      {
        input: 'Please use this thread to discuss the Jurassic World Evolution 2 walkthrough.',
        expected: true
      },
      // Anchored at both ends, and needing the walkthrough's name
      { input: 'Thanks! Please use this thread to discuss the Outer Wilds walkthrough.', expected: false },
      { input: 'Please use this thread to discuss the walkthrough.', expected: false },
      { input: 'Please use this thread to discuss the Outer Wilds guide.', expected: false },
      // Only a full stop may follow
      { input: 'Please use this thread to discuss the Outer Wilds walkthroughs', expected: false },
      { input: 'Please use this thread to discuss the Outer Wilds walkthrough!', expected: false }
    ]
  },
  {
    name: 'SentencesRegex.walkthroughPublished.test',
    check: (input: string) => SentencesRegex.walkthroughPublished.test(input),
    cases: [
      {
        input:
          'The walkthrough has now been published.\n\nYou can find it here: The Witcher 2: Assassins of Kings (EU Ver) Walkthrough',
        expected: true
      },
      {
        input: 'The walkthrough has now been published.\n\nYou can find it here: Outer Wilds Walkthrough',
        expected: true
      },
      // Both of its lines, in order
      { input: 'The walkthrough has now been published.', expected: false },
      { input: 'You can find it here: Outer Wilds Walkthrough', expected: false },
      {
        input: 'The walkthrough has now been published.\n\nYou can find it here: Outer Wilds Walkthrough. Enjoy!',
        expected: false
      },
      {
        input: 'The walkthrough has now been published!\n\nYou can find it here: Outer Wilds Walkthrough',
        expected: false
      },
      {
        input: 'The walkthrough has now been published.\n\nYou can find it here: Outer Wilds Walkthroughs',
        expected: false
      }
    ]
  }
])('$name', ({ check, cases }) => {
  test.concurrent.each(cases)('should test regex $input - $expected', ({ input, expected }) => {
    expect(check(input)).toEqual(expected);
  });
});
