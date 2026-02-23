import React, { useState, useMemo } from "react";
import Layout from "../../../components/layout/Layout";
import PrescriptionCard from "../../../components/cards/PrescriptionCard";
import PrescriptionTemplate from "./PrescriptionTemplate";
import { useQuery } from "@tanstack/react-query";
import { getAllPrescription } from "../../api/prescription.api";

const Prescription = () => {
  const [selectedData, setSelectedData] = useState(null);
  const [openPrescriptionView, setOpenPrescriptionView] = useState(false);

  const { data: prescriptionRes, isLoading } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: getAllPrescription,
  });

  //console.log("Prescription RES:", prescriptionRes);

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
        raw: item,
      })) || []
    );
  }, [prescriptionRes]);

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-[#f5fbff] min-h-screen">
        
        {/* ===== Header ===== */}
        <div className="mb-6">
          <h1 className="text-lg sm:text-xl font-semibold">
            Prescriptions
          </h1>
          <p className="text-xs text-gray-500">
            Healthcare &gt; Prescriptions
          </p>
        </div>

        {/* ===== Loading ===== */}
        {isLoading && (
          <p className="text-sm text-gray-500">Loading prescriptions...</p>
        )}

        {/* ===== Cards Grid ===== */}
        {prescriptionCards.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 w-full">
            <img
              src=".././images/nodata.png"
              alt="No data"
              className="w-52 mb-4 opacity-80"
            />
            <p className="text-lg font-semibold text-black">
              No prescriptions found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {prescriptionCards.map((item) => (
              <PrescriptionCard
                key={item.id}
                patientName={item.patientName}
                age={item.age}
                gender={item.gender}
                doctorName={item.doctorName}
                lastVisit={item.lastVisit}
                nextVisit={item.nextVisit}
                activeTab="prescription"
                onView={() => {
                  setSelectedData(item.raw);
                  setOpenPrescriptionView(true);
                }}
              />
            ))}
          </div>
        )}

        {/* ===== Prescription View Modal ===== */}
        <PrescriptionTemplate
          open={openPrescriptionView}
          onClose={() => setOpenPrescriptionView(false)}
          data={selectedData}
        />
      </div>
    </Layout>
  );
};

export default Prescription;


