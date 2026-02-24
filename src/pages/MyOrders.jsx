import { useState } from "react";
import Layout from "../components/layout/Layout";
import Table from "../components/tables/Table";
import { useGetOrdersQuery } from "../store/Api/orderApi";
import Loader from "../components/layout/Loader"
import OrderStatCard from "../components/cards/OrderStatCard";
import { FaShoppingCart } from "react-icons/fa";


const MyOrders = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching, isError } = useGetOrdersQuery({
    page,
    limit,
  });

  //   if (isLoading) {
  //   return (
  //     <Layout>
  //       <div className="flex justify-center items-center h-60">
  //         <Loader />
  //       </div>
  //     </Layout>
  //   );
  // }

  const orders = Array.isArray(data?.data) ? data.data : [];

  // ✅ FIXED (correct backend structure)
  const totalPages = data?.pagination?.totalPages || 1;
  const totalCount = data?.pagination?.totalCount || 0;
  const hasNextPage = data?.pagination?.hasNextPage;
  const hasPrevPage = data?.pagination?.hasPrevPage;

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
        <p className="text-red-500">Failed to load orders</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OrderStatCard
          title="Total Orders"
          icon={FaShoppingCart}
          value={isLoading ? "Loading..." : totalCount}
          percent="+12%"
          color="#0d1827"
        />

      </div>
      <div className="mb-6 mt-6">
        <h1 className="text-xl font-semibold">All Orders</h1>
        <p className="text-sm text-gray-500">
          Showing {orders.length} of {totalCount} orders
        </p>
      </div>

      <Table
        columns={columns}
        data={orders}
        loading={isLoading}
      />



      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => hasPrevPage && setPage((prev) => prev - 1)}
          disabled={!hasPrevPage}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => hasNextPage && setPage((prev) => prev + 1)}
          disabled={!hasNextPage}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </Layout>
  );
};

export default MyOrders;
