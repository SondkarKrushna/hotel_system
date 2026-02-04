const Table = ({ columns, data, loading }) => {
  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">Loading orders...</div>
    );
  }

  if (!data.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No orders found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-gray-50 border border-gray-200 rounded-xl">
      <table className="min-w-full text-sm">
        <thead className="bg-[#0d1827] border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-semibold text-white"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 last:border-none hover:bg-gray-50 transition"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {col.render
                    ? col.render(row)
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
