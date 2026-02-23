import Layout from "../../../components/layout/Layout";
import StatCard from "../../../components/cards/StatCard";
import PaymentTable from "../../../components/table/PaymentTable";
import { FaFilter } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getAllPrescription } from "../../api/prescription.api";
import { getAllInvoices } from "../../api/invoice.api";
import React, { useMemo, useState } from "react";
import CreateInvoice from "../Invoice/CreateInvoice";
import InvoiceTemplate from "../Invoice/InvoiceTemplate";

const Payments = () => {
  const [activeTab, setActiveTab] = useState("pending"); // paid | pending
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openInvoiceView, setOpenInvoiceView] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);


  /* ✅ Fetch API */
  const { data: prescriptionRes, isLoading: loadingPrescriptions } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: getAllPrescription,
  });

  const { data: invoiceRes, isLoading: loadingInvoices } = useQuery({
    queryKey: ["invoices"],
    queryFn: getAllInvoices,
  });

  //console.log("tableData", invoiceRes);

  /* ✅ Normalize API data */
  const prescriptionPayments = useMemo(() => {
    return (
      prescriptionRes?.data?.map((item) => ({
        id: item._id,
        invoiceId: "",
        patient: item.patientId?.patientName ?? "-",
        doctor: item.doctorId?.name ?? "-",
        contact: item.patientId?.contact ?? "-",
        date: new Date(item.createdAt).toLocaleDateString(),
        patientObj: item.patientId,
        doctorObj: item.doctorId,
        amount: Number(item.totalAmount ?? 0),
        status: "Pending",
      })) || []
    );
  }, [prescriptionRes]);

  const invoicePayments = useMemo(() => {
    return (
      invoiceRes?.data?.map((item) => ({
        id: item._id,
        invoiceId: item.invoiceNumber,
        patient: item.patientId?.patientName ?? "-",
        doctor: item.doctorId?.name ?? "-",
        date: new Date(item.createdAt).toLocaleDateString(),
        contact: item.patientId?.contact ?? "-",
        amount: Number(item.totalAmount ?? 0),
        method: item.paymentMethod ?? "-",
        status: "Paid",
      })) || []
    );
  }, [invoiceRes]);

  const tableData = useMemo(() => {
    if (activeTab === "paid") return invoicePayments;
    if (activeTab === "pending") return prescriptionPayments;
    return [];
  }, [activeTab, invoicePayments, prescriptionPayments]);
  /* ✅ Dynamic Stats */
  const stats = useMemo(() => {
    const source = activeTab === "paid" ? invoicePayments : prescriptionPayments;

    const totalAmount = source.reduce((sum, i) => sum + i.amount, 0);

    return activeTab === "paid"
      ? [
        { title: "Total Revenue", value: `₹${totalAmount}`, img: "/images/dollar.png", bg: "#E7F8F2" },
        { title: "Paid Invoices", value: source.length, img: "/images/vector.png", bg: "#EAF0FE" },
      ]
      : [
        { title: "Pending Amount", value: `₹${totalAmount}`, img: "/images/dollar.png", bg: "#FEF5E6" },
        { title: "Pending Prescriptions", value: source.length, img: "/images/vector.png", bg: "#EDD5FF" },
      ];
  }, [activeTab, invoicePayments, prescriptionPayments]);
  const rawInvoices = useMemo(() => invoiceRes?.data || [], [invoiceRes]);

  return (
    <Layout>
      <div className="bg-[#f5fbff] min-h-screen p-4 sm:p-6 space-y-6">
        {/* ===== Tabs ===== */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("paid")}
            className={`px-4 py-2 rounded-md text-sm font-medium
              ${activeTab === "paid"
                ? "bg-[#2D9AD8] text-white"
                : "bg-white border text-gray-600"
              }`}
          >
            Invoice
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-md text-sm font-medium
              ${activeTab === "pending"
                ? "bg-[#2D9AD8] text-white"
                : "bg-white border text-gray-600"
              }`}
          >
            Prescription
          </button>
        </div>

        {/* ✅ Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item, i) => (
            <StatCard key={i} {...item} />
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl border border-gray-200  p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <input
            type="text"
            placeholder="Search by patient"
            className="border border-gray-200  rounded px-3 py-2 text-sm w-full md:w-72"
          />

          <div className="relative w-full md:w-auto">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full md:w-auto border border-gray-200 rounded bg-[#2D9AD836] pl-9 pr-4 py-2 text-sm"
            >
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* ✅ Payments Table */}
        <div className="bg-white rounded-xl overflow-x-auto">
          <PaymentTable
            data={tableData}
            bgColor="#EEF2F7"
            activeTab={activeTab}
            onCreateInvoice={(row) => {
              setSelectedRow(row);
              setOpenInvoiceModal(true);
            }}
            onViewInvoice={(row) => {
              const fullInvoice = rawInvoices.find(inv => inv._id === row.id);
              setSelectedInvoice(fullInvoice);
              setOpenInvoiceView(true);
            }}

          />

        </div>
        {(loadingInvoices || loadingPrescriptions) && (
          <p className="text-center text-sm">Loading...</p>
        )}
      </div>
      {openInvoiceView && (
        <InvoiceTemplate
          open={openInvoiceView}
          data={selectedInvoice}
          onClose={() => {
            setOpenInvoiceView(false);
            setSelectedInvoice(null);
          }}
        />
      )}

      {/* ✅ Invoice Drawer */}
      {openInvoiceModal && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40">

          {/* Drawer */}
          <div className="w-full sm:w-[480px] bg-white h-full shadow-xl
                    animate-slide-in-right">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Create Invoice</h2>
              <button
                onClick={() => setOpenInvoiceModal(false)}
                className="text-xl text-gray-600 hover:text-black"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-4 overflow-y-auto">

              <CreateInvoice
                open={openInvoiceModal}
                prescriptionId={selectedRow?.id}
                patientData={selectedRow?.patientObj}
                doctorData={selectedRow?.doctorObj}
                onClose={() => setOpenInvoiceModal(false)}
              />


            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Payments;
