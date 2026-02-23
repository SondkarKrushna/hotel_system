import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/layout/Layout";
import ProfileCard from "../../../components/cards/ProfileCard";
import PrescriptionDrawer from "../../../components/PrescriptionDrawer";
import { useQuery } from "@tanstack/react-query";
import { patientData } from "../../api/patient.api";

const Patients = () => {
  const navigate = useNavigate();
  const [openPrescription, setOpenPrescription] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const {
    data: patients = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: patientData,
  });

  const handleEditClick = (patient) => {
    navigate(`/receptionist/edit-patient/${patient._id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <p className="text-sm text-gray-500">Loading patients...</p>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <p className="text-sm text-red-500">Failed to load patients</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        <div className="mb-6">
          <h1 className="text-lg sm:text-xl font-semibold">Patients</h1>
          <p className="text-xs text-gray-500">Healthcare &gt; Patients</p>
        </div>

        {patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 w-full col-span-full">
                <img
                  src=".././images/nodata.png"
                  alt="No data"
                  className="w-52 mb-4 opacity-80"
                />
                <p className="text-lg font-semibold text-black">
                  "No patients found"
                </p>
              </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {patients.map((item) => (
              <ProfileCard
                key={item._id}
                type="patient"
                idValue={item.UID}
                image={item.image || "/images/petient.png"}
                name={item.patientName}
                subtitle={`${item.gender} • ${item.age} yrs`}
                leftLabel="Last Visit"
                leftValue={
                  item.visitDate
                    ? new Date(item.visitDate).toLocaleDateString()
                    : "-"
                }
                rightLabel="Doctor"
                rightValue={item.assignedDoctor?.name || "-"}
                profileId={item._id}
                buttonLabel="Add Prescription"
                onEdit={() => handleEditClick(item)}
                onCreatePrescription={() => {
                  setSelectedPatient(item);
                  setOpenPrescription(true);
                }}
              />
            ))} 
          </div>
        )}

        <PrescriptionDrawer
          open={openPrescription}
          onClose={() => setOpenPrescription(false)}
          patientName={selectedPatient?.patientName}
          patientData={selectedPatient}
        />
      </div>
    </Layout>
  );
};

export default Patients;
