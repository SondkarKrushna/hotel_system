import React, { useState } from "react";
import Layout from "../../../components/layout/Layout";
import PrescriptionCard from "../../../components/cards/PrescriptionCard";
import PrescriptionDrawer from "../../../components/PrescriptionDrawer";
import InvoiceTemplate from "./InvoiceTemplate";
import PrescriptionTemplate from "./PrescriptionTemplate";
import { useQuery } from "@tanstack/react-query";
import { getAllPrescription } from "../../api/prescription.api";
import { getAllInvoices } from "../../api/invoice.api";
import { useMemo } from "react";

const Invoice = () => {
  const [activeTab, setActiveTab] = useState("invoice");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [openPrescriptionView, setOpenPrescriptionView] = useState(false);

  const { data: prescriptionRes } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: getAllPrescription,
  });
  //console.log("Prescription RES:", prescriptionRes);

  const { data: invoiceRes } = useQuery({
    queryKey: ["invoices"],
    queryFn: getAllInvoices,
  });
  //console.log("Invoice RES:", invoiceRes);
  const invoiceCards = useMemo(() => {
    return (
      invoiceRes?.data?.map((item) => ({
        id: item._id,
        patientName: item.patientId?.patientName ?? "-",
        age: item.patientId?.age ?? "-",
        gender: item.patientId?.gender ?? "-",
        doctorName: item.doctorId?.name ?? "-",
        lastVisit: new Date(item.issueDate).toLocaleDateString(),
        nextVisit: new Date(item.dueDate).toLocaleDateString(),
        raw: item, // ⭐ keep full object for InvoiceTemplate
      })) || []
    );
  }, [invoiceRes]);

  const prescriptionCards = useMemo(() => {
    return (
      prescriptionRes?.data?.map((item) => ({
        id: item._id,
        patientName: item.patientId?.patientName ?? "-",
        age: item.patientId?.age ?? "-",
        gender: item.patientId?.gender ?? "-",
        doctorName: item.doctorId?.name ?? "-",
        lastVisit: new Date(item.createdAt).toLocaleDateString(),
        nextVisit: "-",
        raw: item, // ⭐ for PrescriptionTemplate
      })) || []
    );
  }, [prescriptionRes]);


  const dataToRender =
    activeTab === "invoice" ? invoiceCards : prescriptionCards;

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-[#f5fbff] min-h-screen">

        {/* ===== Header ===== */}
        <div className="mb-6">
          <h1 className="text-lg sm:text-xl font-semibold">
            Invoice
          </h1>
          <p className="text-xs text-gray-500">
            Healthcare &gt; Invoice
          </p>
        </div>

        {/* ===== Tabs ===== */}
        {/* <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("invoice")}
            className={`px-4 py-2 rounded-md text-sm font-medium
              ${activeTab === "invoice"
                ? "bg-[#2D9AD8] text-white"
                : "bg-white border text-gray-600"
              }`}
          >
            Invoice
          </button> */}

          {/* <button
            onClick={() => setActiveTab("prescription")}
            className={`px-4 py-2 rounded-md text-sm font-medium
              ${activeTab === "prescription"
                ? "bg-[#2D9AD8] text-white"
                : "bg-white border text-gray-600"
              }`}
          >
            Prescription
          </button>
        </div> */}

        {/* ===== Cards Grid ===== */}
        {dataToRender.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 w-full col-span-full">
            <img
              src=".././images/nodata.png"
              alt="No data"
              className="w-52 mb-4 opacity-80"
            />
            <p className="text-lg font-semibold text-black">
              {activeTab === "invoice"
                ? "No invoices found"
                : "No prescriptions found"}
            </p>
          </div>
        ) : (
          <div
            className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
            gap-4
          "
          >
            {dataToRender.map((item) => (
              <PrescriptionCard
                key={item.id}
                patientName={item.patientName}
                age={item.age}
                gender={item.gender}
                doctorName={item.doctorName}
                lastVisit={item.lastVisit}
                nextVisit={item.nextVisit}
                activeTab={activeTab}
                onView={() => {
                  setSelectedData(item.raw); // ✅ pass FULL API object

                  if (activeTab === "invoice") {
                    setOpenViewModal(true);
                  } else {
                    setOpenPrescriptionView(true);
                  }
                }}
              />

            ))}
          </div>
        )}

        {/* ===== Modals ===== */}
        <PrescriptionDrawer
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
        />

        {activeTab === "invoice" && (
          <InvoiceTemplate
            open={openViewModal}
            onClose={() => setOpenViewModal(false)}
            data={selectedData}
          />
        )}
        {activeTab === "prescription" && (
          <PrescriptionTemplate
            open={openPrescriptionView}
            onClose={() => setOpenPrescriptionView(false)}
            data={selectedData}
          />
        )}


      </div>
    </Layout>
  );
};

export default Invoice;
