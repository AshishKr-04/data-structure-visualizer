import assert from "node:assert/strict";
import test from "node:test";
import { binarySearch, bubbleSort, mergeSort, quickSort } from "./sortSearchOps.js";

const unsorted = [42, 12, 68, 21, 9];
const sorted = [9, 12, 21, 42, 68];

test("binarySearch sorts input and finds target index", () => {
  const result = binarySearch(unsorted, 21);

  assert.deepEqual(result.sorted, sorted);
  assert.equal(result.index, 2);
});

test("sorting algorithms return ascending values", () => {
  assert.deepEqual(bubbleSort(unsorted), sorted);
  assert.deepEqual(mergeSort(unsorted), sorted);
  assert.deepEqual(quickSort(unsorted), sorted);
});
