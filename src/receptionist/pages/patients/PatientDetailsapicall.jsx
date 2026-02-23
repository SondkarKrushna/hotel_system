import Layout from "../../components/layout/Layout";
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
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {clearSelectedPatient } from "../store/patientsSlice"

const StatBox = ({ icon: Icon, label, value }) => (
  <div className="border border-gray-100 rounded p-3 flex items-center gap-3 text-sm">
    <div className="w-8 h-8 text-[#000] flex items-center justify-center rounded">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-semibold">{value ?? "-"}</p>
    </div>
  </div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 bg-[#F5FAFF] p-3 rounded border border-gray-100">
    <div className="w-8 h-8 bg-[#2D9AD9] text-white flex items-center justify-center rounded-full">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium">{value ?? "-"}</p>
    </div>
  </div>
);

/* ================= Main Component ================= */

const PatientDetails = () => {
  const [activeTab, setActiveTab] = useState("current");

  const { id } = useParams(); // from route: /patients/:id

  const { selectedPatient, loading, error } = useSelector(
    (state) => state.patients
  );

  /* ================= Loading & Error States ================= */

  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-center">Loading patient details...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6 text-center text-red-500">{error}</div>
      </Layout>
    );
  }

  if (!selectedPatient) return null;

  return (
    <Layout>
      <div className="p-3 sm:p-6 bg-[#F2F8FF] min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ================= LEFT SIDEBAR ================= */}
          <div className="col-span-12 lg:col-span-3 space-y-4">

            {/* Profile Card */}
            <div className="bg-[#2D9AD9] text-white rounded py-10 p-4 text-center">
              <div className="w-13 h-13 border-[#ffff] border-2 rounded-full mx-auto flex items-center justify-center mb-2">
                <img src={selectedPatient.image || ".././images/userplain.png"} alt="" />
              </div>
              <h2 className="font-semibold text-[15px]">
                {selectedPatient.name}
              </h2>
              <p className="text-[15px] font-medium">
                Patient ID : {selectedPatient.id}
              </p>
            </div>

            {/* Stats */}
            <div className="bg-white rounded p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <StatBox icon={User} label="Gender" value={selectedPatient.gender} />
              <StatBox icon={Calendar} label="Age" value={selectedPatient.age} />
              <StatBox icon={Droplet} label="Blood Group" value={selectedPatient.blood_group} />
              <StatBox icon={Ruler} label="Height" value={selectedPatient.height} />
              <StatBox icon={Weight} label="Weight" value={selectedPatient.weight} />
              <StatBox icon={HeartPulse} label="BP" value={selectedPatient.bp} />
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded p-4 space-y-3">
              <h3 className="font-semibold">Contact Information</h3>
              <InfoItem icon={Phone} label="Phone" value={selectedPatient.phone} />
              <InfoItem icon={Mail} label="Email" value={selectedPatient.email} />
              <InfoItem
                icon={Stethoscope}
                label="Assigned Doctor"
                value={selectedPatient.doctor_name}
              />
            </div>

            {/* Health Overview */}
            <div className="bg-white rounded p-4 text-sm">
              <h3 className="font-semibold pb-3 text-[15px]">Health Overview</h3>

              <div className="flex justify-between pb-3">
                <p>Total Visits :</p>
                <p><strong>{selectedPatient.total_visits}</strong></p>
              </div>

              <div className="flex justify-between pb-3">
                <p>Last Visit :</p>
                <p><strong>{selectedPatient.last_visit}</strong></p>
              </div>

              <div className="flex justify-between pb-3">
                <p>Condition :</p>
                <p><strong>{selectedPatient.condition}</strong></p>
              </div>
            </div>
          </div>

          {/* ================= RIGHT CONTENT ================= */}
          <div className="col-span-12 lg:col-span-9 space-y-6">

            {/* Appointment Summary */}
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Appointment & Disease</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="flex flex-col gap-4">
                  <div className="p-3 rounded-lg border bg-[#E651001F] flex items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Recent Visit</p>
                      <p className="font-medium text-sm">
                        {selectedPatient.recent_visit}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border bg-[#04C53B2B] flex items-center gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Next Visit</p>
                      <p className="font-medium text-sm">
                        {selectedPatient.next_visit}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border bg-[#CC25B040]">
                  <p className="text-xs font-semibold text-[#CC25B0] mb-3">
                    Current Condition
                  </p>
                  <p className="font-medium text-[#CC25B0] text-2xl">
                    {selectedPatient.condition}
                  </p>
                </div>
              </div>
            </div>

            {/* ================= TABS ================= */}
            <div className="bg-white rounded-2xl shadow p-6">

              <div className="flex flex-wrap gap-4 border-b pb-3 text-sm font-semibold">
                <button
                  onClick={() => setActiveTab("current")}
                  className={`pb-2 ${
                    activeTab === "current"
                      ? "text-[#2D9AD9] border-b-2 border-[#2D9AD9]"
                      : "text-gray-500"
                  }`}
                >
                  Current Treatment
                </button>

                <button
                  onClick={() => setActiveTab("history")}
                  className={`pb-2 ${
                    activeTab === "history"
                      ? "text-[#2D9AD9] border-b-2 border-[#2D9AD9]"
                      : "text-gray-500"
                  }`}
                >
                  Medical History
                </button>
              </div>

              {/* ================= CURRENT TREATMENT ================= */}
              {activeTab === "current" && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {selectedPatient.current_medications?.map((med) => (
                      <div
                        key={med.id}
                        className="border border-blue-200 p-4 rounded-xl bg-blue-50"
                      >
                        <div className="p-3 rounded-lg border flex items-center gap-3">
                          <BsCapsule className="w-12 h-12 text-white p-2 rounded-md bg-[#2D9AD9]" />
                          <div>
                            <p className="text-lg font-bold">{med.name}</p>
                            <div className="flex gap-2">
                              <FiCalendar className="w-4 h-4 text-gray-500" />
                              <p className="text-sm">
                                {med.start_date} - {med.end_date}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs text-center mt-3">
                          <div className="border rounded-lg py-2 bg-white">
                            Morning<br />{med.morning}
                          </div>
                          <div className="border rounded-lg py-2 bg-blue-100 border-blue-300">
                            Afternoon<br />{med.afternoon}
                          </div>
                          <div className="border rounded-lg py-2 bg-blue-100 border-blue-300">
                            Night<br />{med.night}
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              )}

              {/* ================= MEDICAL HISTORY ================= */}
              {activeTab === "history" && (
                <div className="mt-4 relative pl-6">

                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <div className="space-y-10">

                    {selectedPatient.medical_history?.map((history, index) => (
                      <div
                        key={history.id}
                        className="relative flex flex-col sm:flex-row gap-6"
                      >
                        <div className="relative z-10 ml-[-20px]">
                          <div
                            className={`w-3 h-3 rounded-full mt-3 ${
                              index === 0 ? "bg-[#2D9AD9]" : "bg-[#444c50]"
                            }`}
                          ></div>
                        </div>

                        <div className="flex-1 bg-gray-50 border rounded-xl p-4">

                          <div className="flex items-center gap-3 mb-3">
                            <FiCalendar className="w-5 h-5 text-[#2D9AD9]" />
                            <h2 className="text-lg font-semibold">
                              {history.date}
                            </h2>
                            {index === 0 && (
                              <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                Latest
                              </span>
                            )}
                          </div>

                          <p className="text-[#2D9AD9] font-medium mb-3">
                            {history.diagnosis}
                          </p>

                          {/* Medicines */}
                          <ul className="list-disc ml-5 text-sm space-y-2">
                            {history.medicines.map((med, i) => (
                              <li key={i}>
                                <p className="font-semibold">{med.name}</p>
                                <p className="text-xs text-gray-500">
                                  Morning: {med.morning}, Afternoon: {med.afternoon}, Night: {med.night}
                                </p>
                              </li>
                            ))}
                          </ul>

                          {/* Notes */}
                          <div className="bg-orange-100 text-orange-600 p-2 mt-4 rounded-full border-2 border-orange-500">
                            <strong>Notes:</strong> {history.notes}
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDetails;
