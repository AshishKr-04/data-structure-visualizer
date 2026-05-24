import assert from "node:assert/strict";
import test from "node:test";
import { parseNumber, parseNumberList } from "./validation.js";

test("parseNumber validates numeric input", () => {
  assert.deepEqual(parseNumber("42"), { ok: true, value: 42 });
  assert.equal(parseNumber("abc").ok, false);
});

test("parseNumberList validates comma-separated numeric input", () => {
  assert.deepEqual(parseNumberList("3, 1, 2", 2), { ok: true, value: [3, 1, 2] });
  assert.equal(parseNumberList("3, nope", 2).ok, false);
});
