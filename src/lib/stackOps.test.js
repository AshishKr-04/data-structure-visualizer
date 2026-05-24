import assert from "node:assert/strict";
import test from "node:test";
import { popStack, pushStack } from "./stackOps.js";

test("pushStack adds a value to the top", () => {
  assert.deepEqual(pushStack(["A"], "B"), ["A", "B"]);
});

test("popStack removes and returns the latest value", () => {
  const result = popStack(["A", "B"]);

  assert.deepEqual(result.next, ["A"]);
  assert.equal(result.value, "B");
});

test("popStack handles underflow", () => {
  const result = popStack([]);

  assert.deepEqual(result.next, []);
  assert.equal(result.value, null);
});
