import { Comparison } from './comparison';

export function binarySearchByValue<T, TValue>(
  list: readonly T[],
  value: TValue,
  projection: (item: T) => TValue,
  comparison: Comparison<TValue> = Comparison.standard
) {
  if (!list.length) {
    return -1;
  }
  let start = 0;
  let end = list.length - 1;
  while (start <= end) {
    const middle = Math.floor((start + end) / 2);
    const result = comparison(value, projection(list[middle]));
    if (!result) {
      return middle;
    }
    if (result < 0) {
      end = middle - 1;
    } else {
      start = middle + 1;
    }
  }
  return ~start;
}
