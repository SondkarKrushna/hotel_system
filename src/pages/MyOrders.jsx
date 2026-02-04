import { useState, useMemo } from "react";
import Layout from "../components/layout/Layout";
import Table from "../components/tables/Table";
import { useGetOrdersQuery } from "../store/Api/orderApi";

const MyOrders = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // ✅ Fetch ALL orders
  const { data, isLoading, isError } = useGetOrdersQuery({
    page: 1,
    limit: 1000,
  });

  const allOrders = useMemo(() => {
    if (!Array.isArray(data?.data)) return [];

    return [...data.data].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [data]);

  // ✅ Search across all records
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) =>
      order.customer?.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [allOrders, search]);

  // ✅ Frontend pagination
  const totalPages = Math.ceil(filteredOrders.length / limit);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const columns = [
    {
      label: "Customer",
      key: "customer",
      render: (row) => row.customer?.name || "N/A",
    },
    {
      label: "Items",
      key: "items",
      render: (row) =>
        row.items?.length ? (
          <div className="flex flex-col gap-1">
            {row.items.map((item, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 px-2 py-1 rounded-md inline-block w-fit"
              >
                {item.name} × {item.quantity}
              </span>
            ))}
          </div>
        ) : (
          "No items"
        ),
    },
    {
      label: "Amount",
      key: "grandTotal",
      render: (row) => `₹${row.grandTotal}`,
    },
    {
      label: "Date",
      key: "createdAt",
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString(),
    },
  ];


  if (isError) {
    return (
      <Layout>
        <p className="text-red-500">Failed to load orders</p>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header + Search */}
      <div className="mb-6 mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold">All Orders</h1>
          <p className="text-sm text-gray-500">
            Showing {filteredOrders.length} orders
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by customer name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page on search
          }}
          className="border px-4 py-2 rounded w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Table
        columns={columns}
        data={paginatedOrders}
        loading={isLoading}
      />

      {/* Frontend Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.max(prev - 1, 1))
          }
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, totalPages)
            )
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </Layout>
  );
};

export default MyOrders;
