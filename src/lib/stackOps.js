export function pushStack(stack, value) {
  return [...stack, value];
}

export function popStack(stack) {
  if (stack.length === 0) {
    return { next: stack, value: null };
  }

  return {
    next: stack.slice(0, -1),
    value: stack[stack.length - 1]
  };
}
