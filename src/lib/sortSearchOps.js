export function binarySearch(values, target) {
  const sorted = [...values].sort((a, b) => a - b);
  let left = 0;
  let right = sorted.length - 1;
  const steps = [];

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push({ left, right, mid, value: sorted[mid] });

    if (sorted[mid] === target) {
      return { sorted, index: mid, steps };
    }

    if (sorted[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return { sorted, index: -1, steps };
}

export function bubbleSort(values) {
  const next = [...values];

  for (let i = 0; i < next.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < next.length - i - 1; j++) {
      if (next[j] > next[j + 1]) {
        [next[j], next[j + 1]] = [next[j + 1], next[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }

  return next;
}

export function mergeSort(values) {
  if (values.length <= 1) return [...values];

  const mid = Math.floor(values.length / 2);
  const left = mergeSort(values.slice(0, mid));
  const right = mergeSort(values.slice(mid));
  const merged = [];

  let leftIndex = 0;
  let rightIndex = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) merged.push(left[leftIndex++]);
    else merged.push(right[rightIndex++]);
  }

  return [...merged, ...left.slice(leftIndex), ...right.slice(rightIndex)];
}

export function quickSort(values) {
  if (values.length <= 1) return [...values];

  const [pivot, ...rest] = values;
  const left = rest.filter((value) => value < pivot);
  const right = rest.filter((value) => value >= pivot);

  return [...quickSort(left), pivot, ...quickSort(right)];
}
