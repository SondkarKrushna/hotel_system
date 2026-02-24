import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import PrescriptionCard from "../../components/cards/PrescriptionCard";
import PrescriptionDrawer from "../../components/PrescriptionDrawer";
import ViewPrescriptionCard from "../../components/cards/ViewPrescriptionCard";

const Prescriptions = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const prescriptions = [
    { id: 1, patientName: "Jimmy Cartier", age: 31, gender: "Female", doctorName: "Dr. John Doe", lastVisit: "20-09-2025", nextVisit: "20-09-2025" },
    { id: 2, patientName: "Anna Smith", age: 28, gender: "Female", doctorName: "Dr. Brown", lastVisit: "18-09-2025", nextVisit: "25-09-2025" },
    { id: 3, patientName: "Robert King", age: 40, gender: "Male", doctorName: "Dr. Wilson", lastVisit: "10-09-2025", nextVisit: "20-09-2025" },
    { id: 4, patientName: "Robert King", age: 40, gender: "Male", doctorName: "Dr. Wilson", lastVisit: "10-09-2025", nextVisit: "20-09-2025" },
    { id: 5, patientName: "Robert King", age: 40, gender: "Male", doctorName: "Dr. Wilson", lastVisit: "10-09-2025", nextVisit: "20-09-2025" },
    { id: 6, patientName: "Robert King", age: 40, gender: "Male", doctorName: "Dr. Wilson", lastVisit: "10-09-2025", nextVisit: "20-09-2025" },
  ];

  return (
    <Layout>
      <div className="p-4 sm:p-6 bg-[#f5fbff] min-h-screen">

        {/* ===== Header ===== */}
        <div
          className="
            flex 
            flex-col 
            sm:flex-row 
            sm:items-center 
            sm:justify-between 
            gap-4 
            mb-6
          "
        >
          <div>
            <h1 className="text-lg sm:text-xl font-semibold">
              Prescription
            </h1>
            <p className="text-xs text-gray-500">
              Healthcare &gt; Prescriptions
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedPatient(null);
              setOpenCreateModal(true);
            }}
            className="
              bg-[#2D9AD9] 
              text-white 
              text-sm 
              px-4 
              py-2 
              rounded-lg 
              w-full 
              sm:w-auto
            "
          >
            + Create Prescription
          </button>
        </div>

        {/* ===== Cards Grid ===== */}
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
          {prescriptions.map((item) => (
            <PrescriptionCard
              key={item.id}
              patientName={item.patientName}
              age={item.age}
              gender={item.gender}
              doctorName={item.doctorName}
              lastVisit={item.lastVisit}
              nextVisit={item.nextVisit}
              onView={() => {
                setSelectedPrescription(item);
                setOpenViewModal(true);
              }}
            />
          ))}
        </div>

        {/* ===== Drawers / Modals ===== */}
        <PrescriptionDrawer
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
        />

        <ViewPrescriptionCard
          open={openViewModal}
          onClose={() => setOpenViewModal(false)}
          data={selectedPrescription}
        />
      </div>
    </Layout>
  );
};

export default Prescriptions;
