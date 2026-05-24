export function insertAtEnd(array, value) {
  return [...array, value];
}

export function deleteFirstMatch(array, value) {
  const index = array.indexOf(value);

  if (index === -1) {
    return { next: array, deletedIndex: -1 };
  }

  return {
    next: array.filter((_, itemIndex) => itemIndex !== index),
    deletedIndex: index
  };
}

export function reverseWithSwaps(array) {
  const next = [...array];
  const swaps = [];
  let left = 0;
  let right = next.length - 1;

  while (left < right) {
    swaps.push({ left, right, before: [...next] });
    [next[left], next[right]] = [next[right], next[left]];
    swaps[swaps.length - 1].after = [...next];
    left += 1;
    right -= 1;
  }

  return { next, swaps };
}
