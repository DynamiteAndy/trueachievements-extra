import { getDuplicates } from './array-util';

describe('getDuplicates', () => {
  test('should return an array of duplicate values when unique is set to false', () => {
    const inputArray = [1, 2, 2, 3, 4, 4, 4, 5];
    const expectedDuplicates = [2, 4, 4];
    const result = getDuplicates(inputArray, false);

    expect(result).toEqual(expectedDuplicates);
  });

  test('should return an empty array when no duplicates are found and unique is set to false', () => {
    const inputArray = [1, 2, 3, 4, 5];
    const result = getDuplicates(inputArray, false);

    expect(result).toEqual([]);
  });

  test('should return an array of unique duplicate values when unique is set to true', () => {
    const inputArray = [1, 2, 2, 3, 4, 4, 4, 5];
    const expectedUniqueDuplicates = [2, 4];
    const result = getDuplicates(inputArray, true);

    expect(result).toEqual(expectedUniqueDuplicates);
  });

  test('should return an empty array when no duplicates are found and unique is set to true', () => {
    const inputArray = [1, 2, 3, 4, 5];
    const result = getDuplicates(inputArray, true);

    expect(result).toEqual([]);
  });
});
