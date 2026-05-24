export function buildAdjacency(edges) {
  return edges.reduce((acc, [from, to, weight]) => {
    acc[from] = [...(acc[from] || []), { node: to, weight }];
    acc[to] = [...(acc[to] || []), { node: from, weight }];
    return acc;
  }, {});
}

export function bfsOrder(adjacency, startNode) {
  const queue = [startNode];
  const seen = new Set([startNode]);
  const order = [];

  while (queue.length) {
    const current = queue.shift();
    order.push(current);

    for (const neighbor of adjacency[current] || []) {
      if (!seen.has(neighbor.node)) {
        seen.add(neighbor.node);
        queue.push(neighbor.node);
      }
    }
  }

  return order;
}

export function dfsOrder(adjacency, startNode) {
  const seen = new Set();
  const order = [];

  const visit = (node) => {
    seen.add(node);
    order.push(node);

    for (const neighbor of adjacency[node] || []) {
      if (!seen.has(neighbor.node)) visit(neighbor.node);
    }
  };

  visit(startNode);
  return order;
}

export function dijkstraDistances(adjacency, startNode, nodes) {
  const distances = Object.fromEntries(nodes.map((node) => [node, Infinity]));
  const settled = new Set();
  distances[startNode] = 0;

  while (settled.size < nodes.length) {
    const current = nodes
      .filter((node) => !settled.has(node))
      .sort((a, b) => distances[a] - distances[b])[0];

    if (!current || distances[current] === Infinity) break;
    settled.add(current);

    for (const neighbor of adjacency[current] || []) {
      const candidate = distances[current] + neighbor.weight;
      if (candidate < distances[neighbor.node]) {
        distances[neighbor.node] = candidate;
      }
    }
  }

  return distances;
}
