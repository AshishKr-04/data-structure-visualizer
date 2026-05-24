export function heapInsert(heap, value) {
  const next = [...heap, value];
  let child = next.length - 1;
  const swaps = [];

  while (child > 0) {
    const parent = Math.floor((child - 1) / 2);
    if (next[parent] >= next[child]) break;

    swaps.push([parent, child]);
    [next[parent], next[child]] = [next[child], next[parent]];
    child = parent;
  }

  return { next, swaps };
}

export function extractMax(heap) {
  if (heap.length === 0) {
    return { next: heap, value: null, swaps: [] };
  }

  if (heap.length === 1) {
    return { next: [], value: heap[0], swaps: [] };
  }

  const next = [...heap];
  const value = next[0];
  const swaps = [[0, next.length - 1]];
  [next[0], next[next.length - 1]] = [next[next.length - 1], next[0]];
  next.pop();

  let parent = 0;
  while (true) {
    const left = parent * 2 + 1;
    const right = parent * 2 + 2;
    let largest = parent;

    if (left < next.length && next[left] > next[largest]) largest = left;
    if (right < next.length && next[right] > next[largest]) largest = right;
    if (largest === parent) break;

    swaps.push([parent, largest]);
    [next[parent], next[largest]] = [next[largest], next[parent]];
    parent = largest;
  }

  return { next, value, swaps };
}

export function buildMaxHeap(values) {
  return values.reduce((heap, value) => heapInsert(heap, value).next, []);
}
