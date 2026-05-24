import assert from "node:assert/strict";
import test from "node:test";
import { bfsOrder, buildAdjacency, dfsOrder, dijkstraDistances } from "./graphOps.js";

const edges = [
  ["A", "B", 4],
  ["A", "C", 2],
  ["B", "D", 5],
  ["C", "D", 1]
];

test("buildAdjacency creates an undirected weighted graph", () => {
  const adjacency = buildAdjacency(edges);

  assert.equal(adjacency.A.length, 2);
  assert.deepEqual(adjacency.B[0], { node: "A", weight: 4 });
});

test("bfsOrder and dfsOrder visit reachable nodes", () => {
  const adjacency = buildAdjacency(edges);

  assert.deepEqual(bfsOrder(adjacency, "A"), ["A", "B", "C", "D"]);
  assert.deepEqual(dfsOrder(adjacency, "A"), ["A", "B", "D", "C"]);
});

test("dijkstraDistances computes shortest paths", () => {
  const adjacency = buildAdjacency(edges);

  assert.deepEqual(dijkstraDistances(adjacency, "A", ["A", "B", "C", "D"]), {
    A: 0,
    B: 4,
    C: 2,
    D: 3
  });
});
