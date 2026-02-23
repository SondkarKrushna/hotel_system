import Layout from "../../../components/layout/Layout";
import {
  User,
  Calendar,
  Droplet,
  Ruler,
  Weight,
  HeartPulse,
  Phone,
  Mail,
  Stethoscope,
  FileText,
} from "lucide-react";
import { TrendingDown } from "lucide-react";
import { BsCapsule } from "react-icons/bs";
import { FiFileText, FiCalendar } from "react-icons/fi";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { patientById } from "../../api/patient.api";

const StatBox = ({ icon: Icon, label, value }) => (
  <div className="border border-gray-100 rounded p-3 flex items-center gap-3 text-sm">
    <div className="w-8 h-8 text-[#000] flex items-center justify-center rounded">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 bg-[#F5FAFF] p-3 rounded border border-gray-100">

    {/* Icon */}
    <div className="w-8 h-8 flex-shrink-0 bg-[#2D9AD9] text-white flex items-center justify-center rounded-full">
      <Icon size={16} />
    </div>

    {/* Text */}
    <div className="min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium break-all">
        {value}
      </p>
    </div>

  </div>
);



const MedicationCard = ({ name, time }) => (
  <div className="border rounded border-gray-100 p-4 bg-[#F8FBFF]">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold">{name}</h3>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
    <div className="grid grid-cols-3 gap-2 text-xs">
      <div className="bg-white border rounded border-gray-100 p-2 text-center">Morning<br />0</div>
      <div className="bg-blue-50 border rounded border-gray-100 p-2 text-center">Afternoon<br />1</div>
      <div className="bg-blue-50 border rounded border-gray-100 p-2 text-center">Night<br />1</div>
    </div>
  </div>
);
const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
};

const PatientDetails = () => {
  const [activeTab, setActiveTab] = useState("current");
  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["patient-details", id],
    queryFn: () => patientById(id),
    enabled: !!id,
  });

  console.log("Patient API Data:", data);
  console.log("Is Loading:", isLoading);
  console.log("Is Error:", isError);
  console.log("Error Details:", error);

  // Handle loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D9AD9] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading patient details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200">
            <p className="text-red-600 font-semibold mb-2">Error loading patient details</p>
            <p className="text-red-500 text-sm">{error?.message || "Unknown error occurred"}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle no data state
  if (!data) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-yellow-50 p-8 rounded-lg border border-yellow-200">
            <p className="text-yellow-600 font-semibold">No patient data found</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Access data correctly - API returns data.data structure
  const patient = data?.patient || {};
  const currentTreatment = data?.current || {};
  const currentMedications = data?.current?.medications?.[0]?.medicines || [];
  const medicalHistory = data?.medicalHistory || [];
  const overview = data?.overview || {};
  const latestVisit = medicalHistory?.[medicalHistory.length - 1];

  const {
    patientName,
    image,
    UID,
    gender,
    age,
    bloodGroup,
    height,
    weight,
    bloodPressure,
    contact,
    email,
    assignedDoctor,
    visitDate,
    disease,
  } = patient;


  return (
    <Layout>
      <div className="bg-[#F2F8FF] min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Profile Section */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="bg-[#2D9AD9] text-white rounded border-gray-100 py-10 p-4 blt text-center">
              <div className="w-13 h-13 bg-#2D9AD9 border-[#ffff] border-2 rounded-full mx-auto flex items-center justify-center mb-2">
                <span className="text-2xl">
                  <img src={image || "/images/userplain.png"} alt="" />
                </span>
              </div>
              <h2 className="font-semibold text-[15px]">
                {patientName || "-"}
              </h2>

              <p className="text-[15px] font-medium">
                Patient ID : {UID || "-"}
              </p>
            </div>

            <div className="bg-white rounded border-gray-100 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <StatBox icon={User} label="Gender" value={gender || "-"} />
              <StatBox icon={Calendar} label="Age" value={age || "-"} />
              <StatBox icon={Droplet} label="Blood Group" value={bloodGroup || "-"} />
              <StatBox icon={Ruler} label="Height" value={height ? `${height} cm` : "-"} />
              <StatBox icon={Weight} label="Weight" value={weight ? `${weight} kg` : "-"} />
              <StatBox icon={HeartPulse} label="BP" value={bloodPressure || "-"} />

            </div>


            <div className="bg-white rounded border-gray-100 p-4 space-y-3">
              <h3 className="font-semibold">Contact Information</h3>
              <InfoItem icon={Phone} label="Phone" value={contact || "-"} />
              <InfoItem icon={Mail} label="Email" value={email || "-"} />
              <InfoItem
                icon={Stethoscope}
                label="Assigned Doctor"
                value={assignedDoctor?.name || "-"}
              />

            </div>

            <div className="bg-white rounded border border-gray-100 p-4 text-sm">
              <h3 className="font-semibold pb-3 text-[15px]">Health Overview</h3>
              <div className="flex items-center gap-4 pb-3">
                <div>
                  <img src="/images/bx_pulse.png" size={24} />
                </div>
                <div className="flex w-full justify-between">
                  <p>Total Visits :</p>
                  <p className="text-right"><strong>{medicalHistory?.length || 0}</strong></p>
                </div>
              </div>
              <div className="flex items-center gap-4 pb-3">
                <div>
                  <img src="/images/bx_pulse.png" size={24} />
                </div>
                <div className="flex w-full justify-between">
                  <p>Last Visit :</p>
                  <p className="text-right"><strong>{formatDate(medicalHistory?.[0]?.formattedDate) || "-"}</strong></p>

                </div>
              </div>
              <div className="flex items-center gap-4 pb-3">
                <div>
                  <img src="/images/bx_pulse.png" size={24} />
                </div>
                <div className="flex w-full justify-between">
                  <p>Condition : </p>
                  <p className="text-right"><strong>{disease || "-"}</strong></p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-6">

            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <h3 className="font-semibold mb-4">Appointment & Disease</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Left column */}
                <div className="flex flex-col gap-4">

                  <div className="p-3 rounded-lg border border-gray-100 bg-[#E651001F] flex items-center gap-3">
                    <img
                      src="/images/timewhite.png"
                      className="p-2 rounded-md bg-[#E65100]"
                      alt="recent visit"
                    />
                    <div>
                      <p className="text-xs text-gray-500">Recent Visit</p>
                      <p className="font-medium text-sm">
                        {latestVisit?.formattedDate || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-gray-100 bg-[#04C53B2B] flex items-center gap-3">
                    <img
                      src="/images/timewhite.png"
                      className="p-2 rounded-md bg-[#47CB00]"
                      alt="next visit"
                    />
                    <div>
                      <p className="text-xs text-gray-500">Next Visit</p>
                      <p className="font-medium text-sm">
                        {latestVisit?.followUp || "-"}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Right column */}
                <div className="p-3 rounded-lg border border-gray-100 bg-[#CC25B040] flex flex-col">
                  <img
                    src="/images/timewhite.png"
                    className="p-2 rounded-md bg-[#CC25B0] mb-3 w-fit"
                    alt="condition"
                  />
                  <p className="text-xs font-semibold text-[#CC25B0] mb-2">
                    Current Condition
                  </p>
                  <p className="font-medium text-[#CC25B0] text-2xl">
                    {currentTreatment?.condition || "-"}
                  </p>
                </div>

              </div>
            </div>


            <div className="bg-white rounded-2xl shadow p-6">

              {/* Tabs Header */}
              <div className="flex flex-wrap gap-4 border-b pb-3 text-sm font-semibold">
                <button
                  onClick={() => setActiveTab("current")}
                  className={`pb-2 ${activeTab === "current"
                    ? "text-[#2D9AD9] border-b-2 border-[#2D9AD9]"
                    : "text-gray-500"
                    }`}
                >
                  Current Treatment
                </button>

                <button
                  onClick={() => setActiveTab("history")}
                  className={`pb-2 ${activeTab === "history"
                    ? "text-[#2D9AD9] border-b-2 border-[#2D9AD9]"
                    : "text-gray-500"
                    }`}
                >
                  Medical History
                </button>
              </div>

              {/* ================= Current Treatment Tab ================= */}
              {activeTab === "current" && (
                <div className="mt-4">

                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-sm">Current Medications</h3>
                      <p className="text-xs text-gray-500">
                        Active prescriptions - For 10 Days
                      </p>
                    </div>

                    <button className="w-10 h-10 text-white p-2 flex items-center justify-center rounded-md bg-pink-500">
                      <BsCapsule />
                    </button>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentMedications.length > 0 ? (
                      currentMedications.map((medItem, index) => (
                        <div
                          key={index}
                          className="border border-blue-200 p-4 rounded-xl bg-blue-50"
                        >
                          <div className="p-3 rounded-lg border border-gray-100 flex items-center gap-3 bg-white">
                            <BsCapsule className="w-12 h-12 text-white p-2 rounded-md bg-[#2D9AD9]" />

                            <div>
                              <p className="text-lg text-black font-bold">
                                {medItem?.name || "Medicine"}
                              </p>

                              <div className="flex gap-2 mt-1">
                                <FiCalendar className="w-4 h-4 mt-0.5 text-gray-500" />
                                <p className="font-medium text-sm text-gray-600">
                                  Duration: {medItem?.duration || "-"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Medicine Details */}
                          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-white border rounded-lg p-2">
                              <p className="text-xs text-gray-500">Dosage</p>
                              <p className="font-semibold">{medItem?.dosage || "-"}</p>
                            </div>

                            <div className="bg-white border rounded-lg p-2">
                              <p className="text-xs text-gray-500">Frequency</p>
                              <p className="font-semibold">{medItem?.frequency || "-"}</p>
                            </div>

                            <div className="bg-white border rounded-lg p-2">
                              <p className="text-xs text-gray-500">Route</p>
                              <p className="font-semibold">{medItem?.route || "-"}</p>
                            </div>

                            <div className="bg-white border rounded-lg p-2">
                              <p className="text-xs text-gray-500">Instructions</p>
                              <p className="font-semibold">{medItem?.instructions || "-"}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No current medications found.</p>
                    )}
                  </div>


                </div>
              )}


              {/* ================= Medical History Tab ================= */}
              {activeTab === "history" && (
                <div className="mt-4 relative pl-6 sm:pl-8">

                  {/* Vertical Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <div className="space-y-10">

                    {medicalHistory?.length > 0 ? (
                      medicalHistory
                        .slice()
                        .reverse()
                        .map((history, index) => (
                          <div
                            key={index}
                            className="relative flex flex-col sm:flex-row gap-6"
                          >
                            {/* Timeline Dot */}
                            <div className="relative z-10 ml-[-20px]">
                              <div
                                className={`w-3 h-3 rounded-full mt-3 ${index === 0 ? "bg-[#2D9AD9]" : "bg-[#444c50]"
                                  }`}
                              ></div>
                            </div>

                            {/* History Card */}
                            <div className="flex-1 bg-gray-50 border-gray-100 border rounded-xl p-4">

                              {/* Header only for Latest */}
                              {index === 0 && (
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                  <h3 className="font-semibold">Patient Medical History</h3>
                                  <button className="text-sm bg-[#2D9AD9] text-white px-3 py-1 rounded">
                                    Export History
                                  </button>
                                </div>
                              )}

                              {/* Date */}
                              <div className="flex items-center gap-3 mb-3">
                                <div className="flex gap-2">
                                  <FiCalendar className="w-5 h-5 mt-0.5 text-[#2D9AD9]" />
                                  <h2 className="text-lg font-semibold text-black">
                                    {history?.formattedDate ||
                                      new Date(history?.date).toLocaleDateString()}
                                  </h2>
                                </div>

                                {index === 0 && (
                                  <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                    Latest
                                  </span>
                                )}
                              </div>

                              {/* Diagnosis */}
                              <p className="text-[#2D9AD9] font-medium mb-3">
                                {history?.diagnosis?.length > 0
                                  ? history.diagnosis.join(", ")
                                  : "-"}
                              </p>

                              {/* Complaints */}
                              <p className="text-sm text-gray-600 mb-3">
                                <span className="font-semibold text-black">Complaints:</span>{" "}
                                {history?.complaints || "-"}
                              </p>

                              {/* Vitals */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">

                                <div className="border border-blue-100 rounded-lg p-2 flex items-center gap-3 bg-white">
                                  <div>
                                    <div className="flex gap-2">
                                      <img src=".././images/bx_pulse.png" alt="weight" />
                                      <p className="text-sm text-gray-500">Weight</p>
                                    </div>
                                    <p className="font-semibold text-black">
                                      {history?.vitals?.weight || "-"}
                                    </p>
                                  </div>
                                </div>

                                <div className="border border-blue-100 rounded-lg p-2 flex items-center gap-3 bg-white">
                                  <div>
                                    <div className="flex gap-2">
                                      <img src=".././images/bx_pulse.png" alt="bp" />
                                      <p className="text-sm text-gray-500">Blood Pressure</p>
                                    </div>
                                    <p className="font-semibold text-black">
                                      {history?.vitals?.bp || "-"}
                                    </p>
                                  </div>
                                </div>

                                <div className="border border-blue-100 rounded-lg p-2 flex items-center gap-3 bg-white">
                                  <div>
                                    <div className="flex gap-2">
                                      <img src=".././images/bx_pulse.png" alt="spo2" />
                                      <p className="text-sm text-gray-500">SpO2</p>
                                    </div>
                                    <p className="font-semibold text-black">
                                      {history?.vitals?.spo2 || "-"}
                                    </p>
                                  </div>
                                </div>

                              </div>

                              {/* Doctor + Slot */}
                              <p className="text-sm text-gray-600 mb-2">
                                <span className="font-semibold text-black">Doctor:</span>{" "}
                                {history?.doctor || "-"}{" "}
                                <span className="text-gray-500">
                                  ({history?.doctorSpecialization || "-"})
                                </span>
                              </p>

                              <p className="text-sm text-gray-600 mb-3">
                                <span className="font-semibold text-black">Time Slot:</span>{" "}
                                {history?.timeSlot || "-"}
                              </p>

                              <div className="mt-5">
                                <div className="flex mb-2">
                                  <BsCapsule className="w-8 h-8 text-[#2D9AD9] p-2 rounded-md" />
                                  <h4 className="font-medium text-sm mt-2">
                                    Prescribed Medicines
                                  </h4>
                                </div>

                                {history?.medicines?.length > 0 ? (
                                  <ul className="list-disc ml-5 text-sm space-y-2">
                                    {history.medicines.map((med, i) => (
                                      <li key={i}>
                                        <p className="font-semibold">{med?.name || "-"}</p>

                                        <p className="text-xs text-gray-500">
                                          Dosage: {med?.dosage || "-"} | Frequency: {med?.frequency || "-"} | Duration: {med?.duration || "-"}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                          Route: {med?.route || "-"} | Instructions: {med?.instructions || "-"}
                                        </p>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-gray-500 text-sm">No medicines available.</p>
                                )}
                              </div>



                              {/* Advice */}
                              {history?.advice && (
                                <div className="bg-green-100 text-green-700 p-3 mt-4 rounded-lg border border-green-300">
                                  <strong>Advice:</strong> {history.advice}
                                </div>
                              )}

                              {/* Follow Up */}
                              {history?.followUp?.type && (
                                <div className="bg-blue-100 text-blue-700 p-3 mt-4 rounded-lg border border-blue-300">
                                  <strong>Follow Up:</strong>{" "}
                                  {new Date(history.followUp.type).toLocaleDateString()}
                                  <p className="text-xs text-gray-600 mt-1">
                                    {history.followUp.note}
                                  </p>
                                </div>
                              )}

                              {/* Notes */}
                              <div className="bg-orange-100 text-orange-600 p-2 mt-4 rounded-full border-2 border-orange-500">
                                <strong>Notes:</strong> {history?.notes || "No notes"}
                              </div>

                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-gray-500 text-sm">No medical history found.</p>
                    )}

                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
export default PatientDetails