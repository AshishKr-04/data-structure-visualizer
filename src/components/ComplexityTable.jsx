function ComplexityTable({ complexity }) {
  return (
    <table className="complexity-table">
      <thead>
        <tr>
          <th>Operation</th>
          <th>Complexity</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(complexity).map(([operation, value]) => (
          <tr key={operation}>
            <td>{operation}</td>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ComplexityTable;
