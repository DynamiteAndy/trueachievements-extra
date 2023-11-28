import { getDuplicates } from './array-util';

describe('getDuplicates', () => {
  it('should return an array of duplicate values when unique is set to false', () => {
    const inputArray = [1, 2, 2, 3, 4, 4, 4, 5];
    const expectedDuplicates = [2, 4, 4];
    const result = getDuplicates(inputArray, false);

    expect(result).toEqual(expectedDuplicates);
  });

  it('should return an empty array when no duplicates are found and unique is set to false', () => {
    const inputArray = [1, 2, 3, 4, 5];
    const result = getDuplicates(inputArray, false);

    expect(result).toEqual([]);
  });

  it('should return an array of unique duplicate values when unique is set to true', () => {
    const inputArray = [1, 2, 2, 3, 4, 4, 4, 5];
    const expectedUniqueDuplicates = [2, 4];
    const result = getDuplicates(inputArray, true);

    expect(result).toEqual(expectedUniqueDuplicates);
  });

  it('should return an empty array when no duplicates are found and unique is set to true', () => {
    const inputArray = [1, 2, 3, 4, 5];
    const result = getDuplicates(inputArray, true);

    expect(result).toEqual([]);
  });
});
