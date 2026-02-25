import Layout from "../../components/layout/Layout";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Skeleton from "../../components/ui/Skeleton";
import Table from "../../components/tables/Table";
import {
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
} from "lucide-react";

import { useGetEmployeeByIdQuery } from "../../store/Api/employeeApi";

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 bg-[#F5FAFF] p-3 rounded border border-gray-100">
    <div className="w-8 h-8 bg-[#24435d] text-white flex items-center justify-center rounded-full">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium break-all">{value || "N/A"}</p>
    </div>
  </div>
);

const EmployeeDetails = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useGetEmployeeByIdQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="bg-[#F2F8FF] min-h-screen p-6">
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen text-red-500">
          Failed to load employee details
        </div>
      </Layout>
    );
  }

  // Extract API Data
  const employee = data?.data?.employee || {};
  const profile = employee?.profile || {};
  const salaryHistory = employee?.salaryHistory || [];

  const salaryColumns = [
    {
      label: "Month",
      key: "month",
    },
    {
      label: "Amount",
      key: "amount",
      render: (row) => `₹ ${row.amount}`,
    },
    {
      label: "Paid On",
      key: "paidOn",
      render: (row) =>
        row.paidOn ? new Date(row.paidOn).toLocaleDateString() : "N/A",
    },
  ];

  const [activeTab, setActiveTab] = useState("orders");

  return (
    <Layout>
      <div className="bg-[#F2F8FF] min-h-screen p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ================= LEFT SIDE ================= */}
          <div className="col-span-12 lg:col-span-4 space-y-4">

            {/* Profile Card */}
            <div className="bg-[#24435d] text-white rounded p-6 text-center">
              <div className="w-20 h-20 bg-white rounded-full mx-auto mb-3 overflow-hidden">
                <img
                  src={profile?.avatar || "/images/user.jpg"}
                  alt="employee"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="font-semibold text-lg">Name: ABCD</h2>
              <p className="text-sm capitalize">Role: staff</p>
            </div>

            {/* Contact Info */}
            <div className="bg-white p-4 rounded space-y-3">
              <h3 className="font-semibold">Employee Information</h3>

              <InfoItem
                icon={Phone}
                label="Phone"
                value={profile?.phone}
              />

              <InfoItem
                icon={Mail}
                label="Email"
                value={profile?.email}
              />

              <InfoItem
                icon={MapPin}
                label="Address"
                value={profile?.address}
              />
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-2xl shadow p-6">

              {/* ================= TABS ================= */}
              <div className="flex gap-6 border-b pb-3 text-sm font-semibold">
                {["orders", "customers"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 capitalize ${activeTab === tab
                      ? "text-[#24435d] border-b-2 border-[#24435d]"
                      : "text-gray-500"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* ================= TAB CONTENT ================= */}
              <div className="mt-6">
                {/* ===== ORDERS TAB (Dummy Content) ===== */}
                {activeTab === "orders" && (
                  <div className="space-y-6">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between border border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500">Total Orders</p>
                          <h3 className="text-2xl font-bold text-[#24435d]">
                            24
                          </h3>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between border border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500">Total Revenue</p>
                          <h3 className="text-2xl font-bold text-green-600">
                            ₹ 18,500
                          </h3>
                        </div>
                      </div>

                    </div>

                    {/* Dummy Orders Table */}
                    <Table
                      columns={[
                        { label: "Customer", key: "customer" },
                        { label: "Items", key: "items" },
                        { label: "Amount", key: "amount" },
                        { label: "Status", key: "status" },
                      ]}
                      data={[
                        {
                          customer: "Rahul Patil",
                          items: 3,
                          amount: "₹ 1,250",
                          status: "Completed",
                        },
                        {
                          customer: "Sneha Sharma",
                          items: 2,
                          amount: "₹ 850",
                          status: "Pending",
                        },
                      ]}
                      loading={false}
                    />
                  </div>
                )}

                {/* ===== CUSTOMERS TAB (Dummy Content) ===== */}
                {activeTab === "customers" && (
                  <Table
                    columns={[
                      { label: "Customer Name", key: "name" },
                      { label: "Phone", key: "phone" },
                      { label: "Total Orders", key: "orders" },
                    ]}
                    data={[
                      {
                        name: "Amit Kulkarni",
                        phone: "9876543210",
                        orders: 5,
                      },
                      {
                        name: "Pooja Deshmukh",
                        phone: "9123456780",
                        orders: 3,
                      },
                    ]}
                    loading={false}
                  />
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDetails;