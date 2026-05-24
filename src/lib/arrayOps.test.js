import assert from "node:assert/strict";
import test from "node:test";
import { deleteFirstMatch, insertAtEnd, reverseWithSwaps } from "./arrayOps.js";

test("insertAtEnd appends without mutating the original array", () => {
  const original = [1, 2];
  const next = insertAtEnd(original, 3);

  assert.deepEqual(next, [1, 2, 3]);
  assert.deepEqual(original, [1, 2]);
});

test("deleteFirstMatch removes only the first matching value", () => {
  const result = deleteFirstMatch([4, 7, 4], 4);

  assert.deepEqual(result.next, [7, 4]);
  assert.equal(result.deletedIndex, 0);
});

test("reverseWithSwaps returns the reversed array and swap trace", () => {
  const result = reverseWithSwaps([1, 2, 3, 4]);

  assert.deepEqual(result.next, [4, 3, 2, 1]);
  assert.equal(result.swaps.length, 2);
});
