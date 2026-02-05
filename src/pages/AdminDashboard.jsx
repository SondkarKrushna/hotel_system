import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import StatCard from "../components/cards/StatCard";
import Table from "../components/tables/Table";
import { ShoppingCart, IndianRupee } from "lucide-react";
import { useGetOrdersQuery } from "../store/Api/orderApi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null); // ✅ Modal state

  const { data, isLoading, isError } = useGetOrdersQuery({
    page: 1,
    limit: 10,
  });

  const orders = Array.isArray(data?.data) ? data.data : [];

  const latestOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [orders]);

  const totalOrders = data?.summary?.totalOrders || 0;
  const totalRevenue = data?.summary?.totalRevenue || 0;

  const stats = [
    {
      title: "Total Orders",
      value: isLoading ? "Loading..." : totalOrders,
      icon: ShoppingCart,
      bg: "#EAF0FE",
    },
    {
      title: "Total Revenue",
      value: isLoading ? "Loading..." : `₹${totalRevenue}`,
      icon: IndianRupee,
      bg: "#F3EEFE",
    },
  ];

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
        <p className="text-red-500">Failed to load dashboard data</p>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </div>

      {/* Latest Orders */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">
          Latest 10 Orders
        </h2>

        <div className="w-full overflow-x-auto">
          <div className="sm:text-base text-xs">
            <Table
              columns={columns}
              data={latestOrders}
              loading={isLoading}
            />
          </div>
        </div>

      </div>

      {/* ✅ Popup Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50">
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

export default Dashboard;
