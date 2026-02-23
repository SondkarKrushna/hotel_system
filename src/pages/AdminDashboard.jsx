<<<<<<< HEAD
import { useMemo, useState } from "react";
=======
>>>>>>> 8d7bf0b0f71c57eb9a06e99423c7a209f8f1c5d7
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import StatCard from "../components/cards/StatCard";
import Table from "../components/tables/Table";
<<<<<<< HEAD
import Skeleton from "../components/ui/Skeleton";
import { ShoppingCart, IndianRupee, Users, Utensils } from "lucide-react";
=======
import { ShoppingCart, IndianRupee } from "lucide-react";
>>>>>>> 8d7bf0b0f71c57eb9a06e99423c7a209f8f1c5d7
import { useGetOrdersQuery } from "../store/Api/orderApi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("orders"); // Tab: orders, staff, dishes

  const { data, isLoading, isError } = useGetOrdersQuery({
    page: 1,
    limit: 10,
  });

  // Handle both old structure (orders) and new structure (hotel dashboard)
  const hotelData = data?.data?.hotel ? data.data : null;
  const orders = Array.isArray(data?.data) ? data.data : [];
  const staff = Array.isArray(hotelData?.staff) ? hotelData.staff : [];
  const dishes = Array.isArray(hotelData?.dishes) ? hotelData.dishes : [];

  const latestOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [orders]);

  // Get stats from new API response
  const totalOrders = hotelData?.summary?.counts?.orders || data?.summary?.totalOrders || 0;
  const totalRevenue = hotelData?.summary?.financials?.totalRevenue || data?.summary?.totalRevenue || 0;
  const totalStaff = hotelData?.summary?.counts?.staff || 0;
  const totalDishes = hotelData?.summary?.counts?.dishes || 0;

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
    {
      title: "Total Staff",
      value: isLoading ? "Loading..." : totalStaff,
      icon: Users,
      bg: "#FFF4E6",
    },
    {
      title: "Total Dishes",
      value: isLoading ? "Loading..." : totalDishes,
      icon: Utensils,
      bg: "#E6F9F0",
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
  ];

  const staffColumns = [
    {
      label: "Name",
      key: "profile",
      render: (row) => row.profile?.name || "N/A",
    },
    {
      label: "Username",
      key: "username",
      render: (row) => row.username || "N/A",
    },
    {
      label: "Email",
      key: "profile",
      render: (row) => row.profile?.email || "N/A",
    },
    {
      label: "Phone",
      key: "phone",
      render: (row) => row.phone || "N/A",
    },
  ];

  const dishesColumns = [
    {
      label: "Dish Name",
      key: "name",
      render: (row) => row.name || "N/A",
    },
    {
      label: "Type",
      key: "type",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${row.type === "veg" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {row.type?.charAt(0).toUpperCase() + row.type?.slice(1)}
        </span>
      ),
    },
    {
      label: "Price",
      key: "price",
      render: (row) => `₹${row.price}`,
    },
    {
      label: "Availability",
      key: "isAvailable",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${row.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {row.isAvailable ? "Available" : "Unavailable"}
        </span>
      ),
    },
  ];

  if (isError) {
    return (
      <Layout>
        <p className="text-red-500">Failed to load dashboard data</p>
      </Layout>
    );
  }

<<<<<<< HEAD
  return (
    <Layout>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
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

      {/* Tabs */}
      {hotelData && (
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 font-medium transition ${activeTab === "orders"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("staff")}
            className={`px-4 py-2 font-medium transition ${activeTab === "staff"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Staff ({staff.length})
          </button>
          <button
            onClick={() => setActiveTab("dishes")}
            className={`px-4 py-2 font-medium transition ${activeTab === "dishes"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Dishes ({dishes.length})
          </button>
        </div>
      )}


      {/* Content based on active tab */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">
          {activeTab === "orders" && "Latest 10 Orders"}
          {activeTab === "staff" && "Staff Members"}
          {activeTab === "dishes" && "Available Dishes"}
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
              <>
                {activeTab === "orders" && (
                  <Table
                    columns={columns}
                    data={latestOrders.slice(0, 10)}
                    loading={isLoading}
                  />
                )}
                {activeTab === "staff" && (
                  <Table
                    columns={staffColumns}
                    data={staff}
                    loading={isLoading}
                  />
                )}
                {activeTab === "dishes" && (
                  <Table
                    columns={dishesColumns}
                    data={dishes}
                    loading={isLoading}
                  />
                )}
              </>
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

=======
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetOrdersQuery({
    page: 1,
    limit: 10,
  });

  const orders = Array.isArray(data?.data) ? data.data : [];

  const latestOrders = [...orders].reverse();


  const totalRevenue = orders.reduce(
    (sum, item) => sum + (item.grandTotal || 0),
    0
  );

  const stats = [
    {
      title: "Total Orders",
      value: isLoading ? "Loading..." : orders.length,
      subtitle: "All Orders",
      icon: ShoppingCart,
      bg: "#EAF0FE",
      onClick: () => navigate('/myorders'),
    },
    {
      title: "Total Revenue",
      value: isLoading ? "Loading..." : `₹${totalRevenue}`,
      subtitle: "All Revenue",
      icon: IndianRupee,
      bg: "#F3EEFE",
      onClick: () => navigate('/totalrevenue'),
    },
  ];


  const columns = [
    {
      label: "Customer",
      key: "customer",
      render: (row) => row.customer?.name || "N/A",
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {stats.map((item, i) => (
          <StatCard key={i} {...item} />
        ))}
      </div>

      {/* Latest 10 Orders */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">
          Latest 10 Orders
        </h2>

        <Table
          columns={columns}
          data={latestOrders}
          loading={isLoading}
        />
      </div>
>>>>>>> 8d7bf0b0f71c57eb9a06e99423c7a209f8f1c5d7
    </Layout>
  );
};

export default Dashboard;