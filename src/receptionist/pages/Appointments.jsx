import Layout from "../../components/layout/Layout";
import PaymentTable from "../../components/table/PaymentTable";
import { FaSyncAlt, FaPlus, FaSort } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAppointments } from "../api/appointment.api";
import PrescriptionDrawer from "../../components/PrescriptionDrawer";

const Appointments = () => {
  const [period, setPeriod] = useState("today");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
const [openPrescription, setOpenPrescription] = useState(false);
const [selectedPatient, setSelectedPatient] = useState(null);
//console.log("Selected Patient:", selectedPatient);
  const {
    data: appointmentsResponse = {},
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["appointments", period, startDate, endDate],
    queryFn: () => getAppointments(period, startDate, endDate),
    enabled: period !== "custom" || !!(startDate && endDate),
    keepPreviousData: true,
  });

  const navigate = useNavigate();

  // Extract appointments array from response
  const appointments = Array.isArray(appointmentsResponse)
    ? appointmentsResponse
    : appointmentsResponse.data || [];
  //console.log("Appointments Data:", appointments);
  const tableData = appointments.map((item, index) => ({
    patient_id: item.patientId?._id || `#00${index + 1}`,
    patientId: item.patientId?.UID || `#00${index + 1}`,
    name: item.patientId?.patientName || "N/A",
    image: item.patientId?.image || ".././images/petient1.png",
    disease: item.disease || "Not specified",
    contact: item.patientId?.contact || "N/A",
    email: item.patientId?.email || "N/A",
    dateTime: item.appointmentDate ? `${new Date(item.appointmentDate).toLocaleDateString()} , ${item.timeSlot || ""}` : "N/A",
    doctorName: item.doctorId?.name || "N/A",
    status: item.status || "pending",
  }));

  return (
    <Layout>
      <div className="bg-[#f5fbff] min-h-screen p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Appointments</h1>
            <p className="text-xs text-gray-500">
              Healthcare → Appointments
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refetch}
              className="p-2 bg-[#EEF2F7] rounded-lg"
            >
              <FaSyncAlt className="text-[#2D9AD9]" />
            </button>

            <button
              onClick={() => navigate("/receptionist/add-patient", { state: { activeTab: "existing" } })}
              className="flex items-center gap-2 bg-[#2D9AD8] text-white px-4 py-2 rounded-lg text-sm"
            >
              <FaPlus />
              Add Appointment
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border  border-gray-200 shadow-sm">

          {/* Card Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <h2 className="font-medium">Total Appointments</h2>
              <span className="bg-[#E60000] text-white text-xs px-4 py-1 rounded-sm">
                {tableData.length}
              </span>
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-1.5 text-sm">
              <FaSort className="text-gray-500 text-xs" />

              <select
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value);
                  if (e.target.value !== "custom") {
                    setStartDate("");
                    setEndDate("");
                  }
                }}
                className="outline-none bg-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="custom">Custom</option>
              </select>

              {period === "custom" && (
                <>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="ml-2 border border-gray-200 rounded px-2 py-1 text-xs outline-none"
                  />

                  <span className="text-gray-400 text-xs">to</span>

                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-200 rounded px-2 py-1 text-xs outline-none"
                  />
                </>
              )}
            </div>

          </div>

          {/* Table */}
          <div className="p-0">
            {isLoading ? (
              <p className="text-center p-4">Loading appointments...</p>
            ) : isError ? (
              <p className="text-center text-red-500 p-4">
                Failed to load appointments
              </p>
            ) : (
              <PaymentTable
                data={tableData}
                bgColor="#EEF2F7"
                type="appointment"
                onAddPrescription={(patient) => {
                    setSelectedPatient({ ...patient, patient_id: patient.patient_id });
                    setOpenPrescription(true);
                  }}
              />
            )}
          </div>
          
              <PrescriptionDrawer
                open={openPrescription}
                onClose={() => setOpenPrescription(false)}
                patientName={selectedPatient?.name || "Unknown Patient"}
                patientData={selectedPatient}
              />

        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
