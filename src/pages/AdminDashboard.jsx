import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import StatCard from "../components/cards/StatCard";
import Table from "../components/tables/Table";
import { ShoppingCart, IndianRupee } from "lucide-react";
import { useGetOrdersQuery } from "../store/Api/orderApi";

const Dashboard = () => {

  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetOrdersQuery({
    page: 1,
    limit: 10,
  });

  const orders = Array.isArray(data?.data) ? data.data : [];

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );


  const latestOrders = [...orders].reverse();


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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
          data={sortedOrders}
          loading={isLoading}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
