import assert from "node:assert/strict";
import test from "node:test";
import { buildMaxHeap, extractMax, heapInsert } from "./heapOps.js";

function isMaxHeap(heap) {
  return heap.every((value, index) => {
    const left = index * 2 + 1;
    const right = index * 2 + 2;
    return (
      (left >= heap.length || value >= heap[left]) &&
      (right >= heap.length || value >= heap[right])
    );
  });
}

test("heapInsert preserves max heap order", () => {
  const result = heapInsert([90, 72, 61], 100);

  assert.equal(result.next[0], 100);
  assert.equal(isMaxHeap(result.next), true);
});

test("extractMax removes the largest value", () => {
  const result = extractMax([90, 72, 61, 44, 35]);

  assert.equal(result.value, 90);
  assert.equal(isMaxHeap(result.next), true);
});

test("buildMaxHeap creates a valid max heap", () => {
  const heap = buildMaxHeap([12, 90, 4, 55, 72]);

  assert.equal(heap[0], 90);
  assert.equal(isMaxHeap(heap), true);
});
