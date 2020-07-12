/**
 * Given two values of the same type, returns a value used for sorting.
 * If the two comparands are equal, the expected result is 0.
 * If the left comparand is greater than the right, a positive number is expected (i.e. 1).
 * If the right comparand is greater than the left, a negative number is expected (i.e. -1).
 */
export type Comparison<TValue = any> = (left: TValue, right: TValue) => number;

export namespace Comparison {
  /**
   * Implements the standard comparison between two values.
   * @param left The left comparand.
   * @param right The right comparand.
   */
  export const standard: Comparison = (left, right) => {
    if (left === right) {
      return 0;
    }
    return left < right ? -1 : 1;
  };
}
