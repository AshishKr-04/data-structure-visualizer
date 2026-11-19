function getComplexityTier(val) {
  const str = String(val).toLowerCase();
  if (str.includes("o(1)") || str.includes("o(log n)")) {
    return { tier: "optimal", label: "Optimal", color: "badge-optimal" };
  }
  if (str.includes("o(n)") && !str.includes("o(n²)") && !str.includes("o(n^2)") && !str.includes("o(n log n)")) {
    return { tier: "linear", label: "Fair", color: "badge-linear" };
  }
  if (str.includes("log n") || str.includes("v + e") || str.includes("v) log v")) {
    return { tier: "good", label: "Efficient", color: "badge-efficient" };
  }
  return { tier: "quadratic", label: "Heavy", color: "badge-quadratic" };
}

function ComplexityTable({ complexity }) {
  return (
    <div className="complexity-table-wrapper">
      <table className="complexity-table">
        <thead>
          <tr>
            <th>Operation</th>
            <th>Big-O</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(complexity).map(([operation, value]) => {
            const { label, color } = getComplexityTier(value);
            return (
              <tr key={operation}>
                <td className="op-name">{operation}</td>
                <td>
                  <code className="complexity-code">{value}</code>
                </td>
                <td>
                  <span className={`complexity-badge ${color}`}>
                    <span className="badge-dot" />
                    {label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ComplexityTable;

