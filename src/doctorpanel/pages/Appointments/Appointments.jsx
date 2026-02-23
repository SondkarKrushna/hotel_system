import React, { useState } from "react";
import AppointmentCard from "../../../components/cards/AppointmentCard";
import Layout from "../../../components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "../../api/appointment.api";
import PrescriptionDrawer from "../../../components/PrescriptionDrawer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  approveAppointment,
  rejectAppointment,
  rescheduleAppointment,
  transferAppointment,
} from "../../api/appointment.api";

import { toast } from "react-toastify";


const tabs = ["All", "Today", "Upcoming", "Completed", "Rejected", "Pending"];

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [openPrescription, setOpenPrescription] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const doctorId = user?.doctorId;

  const getStatusFromTab = (tab) => {
    switch (tab) {
      case "All":
        return "all";
      case "Today":
        return "today";
      case "Upcoming":
        return "upcoming";
      case "Completed":
        return "completed";
      case "Rejected":
        return "cancelled";
      case "Pending":
        return "pending";
      default:
        return "all";
    }
  };



  const status = getStatusFromTab(activeTab);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["appointments", doctorId, status],
    queryFn: () => getAppointments(doctorId, { status }),
    enabled: !!doctorId,
    keepPreviousData: true,
  });

  const appointments = response?.data || [];
  //console.log("Appointments API response:", response);  

  const handleCreatePrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenPrescription(true);
  };
  const queryClient = useQueryClient();

  // APPROVE MUTATION
  const approveMutation = useMutation({
    mutationFn: (appointmentId) => approveAppointment(appointmentId),
    onSuccess: (res) => {
      toast.success(res?.message || "Appointment approved");
      queryClient.invalidateQueries(["appointments"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || "Failed to approve");
    },
  });

  // REJECT MUTATION
  const rejectMutation = useMutation({
    mutationFn: ({ appointmentId, reason }) => rejectAppointment(appointmentId, reason),
    onSuccess: (res) => {
      toast.success(res?.message || "Appointment rejected");
      queryClient.invalidateQueries(["appointments"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || "Failed to reject");
    },
  });

  // RESCHEDULE MUTATION
  const rescheduleMutation = useMutation({
    mutationFn: ({ appointmentId, payload }) =>
      rescheduleAppointment(appointmentId, payload),
    onSuccess: (res) => {
      toast.success(res?.message || "Appointment rescheduled");
      queryClient.invalidateQueries(["appointments"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || "Failed to reschedule");
    },
  });

  // TRANSFER MUTATION
  const transferMutation = useMutation({
    mutationFn: ({ appointmentId, newDoctorId }) =>
      transferAppointment(appointmentId, newDoctorId),
    onSuccess: (res) => {
      toast.success(res?.message || "Appointment transferred");
      queryClient.invalidateQueries(["appointments"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || "Failed to transfer");
    },
  });


  return (
    <Layout>
      <div className="p-6 bg-[#f5fbff] min-h-screen">
        {/* Tabs */}
        <div className="flex gap-3 flex-wrap mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition
                ${activeTab === tab
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <p className="text-gray-500 text-sm">Loading appointments...</p>
        )}

        {/* Error */}
        {isError && (
          <p className="text-red-500 text-sm">
            Failed to load appointments: {error?.response?.data?.error || error?.message}
          </p>
        )}

        {/* Cards */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.length > 0 ? (
              appointments.map((item) => (
                <AppointmentCard
                  key={item._id}
                  data={item}
                  onApprove={() => approveMutation.mutate(item._id)}
                  onReject={() =>
                    rejectMutation.mutate({ appointmentId: item._id, reason: "Rejected by doctor" })
                  }
                  onReschedule={() =>
                    rescheduleMutation.mutate({
                      appointmentId: item._id,
                      payload: {
                        appointmentDate: item.appointmentDate,
                        timeSlot: item.timeSlot,
                      },
                    })
                  }
                  onTransfer={() =>
                    transferMutation.mutate({
                      appointmentId: item._id,
                      newDoctorId: "PUT_NEW_DOCTOR_ID_HERE",
                    })
                  }
                  onCreatePrescription={() => handleCreatePrescription(item)}
                />

              ))
            ) : (
              <p className="text-gray-500">No appointments found.</p>
            )}
          </div>
        )}

        {/* Prescription Drawer */}
        <PrescriptionDrawer
          open={openPrescription}
          onClose={() => setOpenPrescription(false)}
          patientName={selectedAppointment?.patientId?.patientName}
          patientData={selectedAppointment?.patientId}
          appointmentData={selectedAppointment}
        />
      </div>
    </Layout>
  );
};

export default Appointments;
