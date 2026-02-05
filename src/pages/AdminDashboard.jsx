import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import StatCard from "../components/cards/StatCard";
import Table from "../components/tables/Table";
import Skeleton from "../components/ui/Skeleton";
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
    // {
    //   label: "Date",
    //   key: "createdAt",
    //   render: (row) =>
    //     new Date(row.createdAt).toLocaleDateString(),
    // },
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
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl shadow-sm"
            >
              <Skeleton className="h-5 w-24 mb-3" />
              <Skeleton className="h-8 w-20" />
            </div>
          ))
          : stats.map((item, i) => (
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
            {isLoading ? (
              <div className="bg-white p-4 rounded-xl shadow-sm">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center mb-4"
                  >
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/6" />
                    <Skeleton className="h-4 w-1/6" />
                  </div>
                ))}
              </div>
            ) : (
              <Table
                columns={columns}
                data={latestOrders}
                loading={isLoading}
              />
            )}
          </div>
        </div>


      </div>

      {/* ✅ Popup Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative
                 animate-[fadeInScale_.25s_ease-out]"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 
                   transition duration-200 text-xl"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-xl font-semibold mb-1">
              Order Details
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Customer: {selectedOrder.customer?.name}
            </p>

            {/* Items List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {selectedOrder.items?.length ? (
                selectedOrder.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 
                         hover:bg-gray-100 transition 
                         rounded-lg px-3 py-2"
                  >
                    <div>
                      <p className="font-medium text-gray-700">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-gray-800">
                      × {item.quantity}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  No items found
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 border-t pt-4 flex justify-between items-center">
              <span className="text-gray-500 text-sm">
                Grand Total
              </span>
              <span className="text-lg font-bold text-indigo-600">
                ₹{selectedOrder.grandTotal}
              </span>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default Dashboard;