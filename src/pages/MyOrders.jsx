import { useState, useMemo } from "react";
import Layout from "../components/layout/Layout";
import Table from "../components/tables/Table";
import { useGetOrdersQuery } from "../store/Api/orderApi";

const MyOrders = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null); // ✅ Modal state
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
      render: (row) => (
        <button
          onClick={() => setSelectedOrder(row)}
          className="text-gray-600 underline text-sm"
        >
          View
        </button>
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
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="w-full overflow-x-auto">
        <div className="sm:text-base text-xs">
          <Table
            columns={columns}
            data={latestOrders}
            loading={isLoading}
          />
        </div>
      </div>

      {/* Pagination */}
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

      {/* ✅ Modal Popup */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">

            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Items ordered by {selectedOrder.customer?.name}
            </h2>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedOrder.items?.length ? (
                selectedOrder.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between border-b pb-2"
                  >
                    <span>{item.name}</span>
                    <span>× {item.quantity}</span>
                  </div>
                ))
              ) : (
                <p>No items found</p>
              )}
            </div>

            <div className="mt-4 text-right font-semibold">
              Total: ₹{selectedOrder.grandTotal}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MyOrders;
