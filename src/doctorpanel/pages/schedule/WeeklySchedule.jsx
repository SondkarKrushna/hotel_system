import React, { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import AddSlot from "./AddSlot";
import Layout from "../../../components/layout/Layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getScheduleData, deleteDoctorSlot } from "../../api/schedule.api";
import { getAppointments } from "../../api/appointment.api";
import { toast } from "react-toastify";

/* ========================= SLOT COMPONENT ========================= */
const ScheduleSlot = ({
  time,
  title,
  color = "blue",
  onEdit,
  onDelete,
  appointmentId,
}) => {
  const colors = {
    blue: "bg-[#2D9AD8] hover:bg-blue-700",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    red: "bg-red-500 hover:bg-red-600",
    green: "bg-green-500 hover:bg-green-600",
  };

  return (
    <div
      className={`
        w-[95%] mx-auto h-full
        rounded-md p-2 text-white shadow-md 
        z-10 text-sm transition-all
        ${colors[color]}
      `}
    >
      <div className="font-semibold">{time}</div>
      <div className="text-xs">{title}</div>

      {/* Show edit/delete only for availability slots */}
      {!appointmentId && (
        <div className="mt-1 flex space-x-2 text-white/75">
          <FiEdit2
            onClick={onEdit}
            className="cursor-pointer hover:text-white w-4 h-4"
          />

          <FiTrash2
            onClick={onDelete}
            className="cursor-pointer hover:text-white w-4 h-4"
          />
        </div>
      )}
    </div>
  );
};

/* ========================= CONVERT DOCTOR SCHEDULE ========================= */
const convertToScheduleData = (availabilitySchedule) => {
  const dayMap = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };

  const toMinutes = (time) => {
    if (!time) return 0;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  return availabilitySchedule.flatMap((d) => {
    const dayNumber = dayMap[d.day];

    const morningSlots = (d.morning || []).map((s) => {
      const startMin = toMinutes(s.start);
      const endMin = toMinutes(s.end);

      return {
        day: dayNumber,
        start: startMin,
        duration: endMin - startMin,
        time: `${s.start} - ${s.end}`,
        title: "Morning Clinic",
        color: "blue",
        slotId: s._id,
        type: "morning",
        dayName: d.day,
      };
    });

    const eveningSlots = (d.evening || []).map((s) => {
      const startMin = toMinutes(s.start);
      const endMin = toMinutes(s.end);

      return {
        day: dayNumber,
        start: startMin,
        duration: endMin - startMin,
        time: `${s.start} - ${s.end}`,
        title: "Evening Clinic",
        color: "blue",
        slotId: s._id,
        type: "evening",
        dayName: d.day,
      };
    });

    return [...morningSlots, ...eveningSlots];
  });
};

/* ========================= CONVERT APPOINTMENTS ========================= */
const convertAppointmentsToScheduleData = (appointments) => {
  const toMinutes = (time) => {
    if (!time) return 0;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const dayMap = {
    0: 7, // Sunday
    1: 1, // Monday
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6, // Saturday
  };

  return appointments
    .map((a) => {
      if (!a?.appointmentDate || !a?.timeSlot) return null;

      const date = new Date(a.appointmentDate);
      const jsDay = date.getDay();
      const day = dayMap[jsDay];

      let slotParts = [];

      if (typeof a.timeSlot === "string") {
        // supports "10:15-10:30" or "10:15 - 10:30" or "10:15 to 10:30" or "10:15,10:30"
        slotParts = a.timeSlot.split(/\s*(-|,|to)\s*/i).filter(Boolean);
      }

      if (slotParts.length < 2) return null;

      const startTime = slotParts[0].trim();
      const endTime = slotParts[1].trim();

      const startMin = toMinutes(startTime);
      const endMin = toMinutes(endTime);

      return {
        day,
        start: startMin,
        duration: endMin - startMin,
        time: `${startTime} - ${endTime}`,
        title: a.patientId?.patientName || "Booked",
        color: a.status === "confirmed" ? "green" : "red",
        appointmentId: a._id,
        status: a.status,
      };
    })
    .filter(Boolean); // ✅ remove null
};

/* ========================= MAIN COMPONENT ========================= */
export default function WeeklySchedule() {
  const [openModal, setOpenModal] = useState(false);
  const [editSlot, setEditSlot] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const doctorId = user?.doctorId;

  /* ---------- FETCH DOCTOR SCHEDULE ---------- */
  const {
    data: scheduleRes,
    isLoading: scheduleLoading,
    refetch,
  } = useQuery({
    queryKey: ["doctorSlots", doctorId],
    queryFn: () => getScheduleData(doctorId),
    enabled: !!doctorId,
  });

  /* ---------- FETCH APPOINTMENTS ---------- */
  const { data: appointmentRes, isLoading: appointmentLoading } = useQuery({
    queryKey: ["appointments", doctorId],
    queryFn: () => getAppointments(doctorId, {}),
    enabled: !!doctorId,
  });

  /* ---------- DELETE SLOT ---------- */
  const deleteMutation = useMutation({
    mutationFn: deleteDoctorSlot,
    onSuccess: () => {
      toast.success("Slot deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Delete failed");
    },
  });

  /* ---------- AVAILABILITY SCHEDULE ---------- */
  const availabilitySchedule = scheduleRes?.availabilitySchedule || [];
  const scheduleData = convertToScheduleData(availabilitySchedule);

  /* ---------- APPOINTMENTS ---------- */
  const appointments = appointmentRes?.data || [];
  const appointmentScheduleData = convertAppointmentsToScheduleData(appointments);

  /* ---------- FINAL MERGE ---------- */
  const finalScheduleData = [...scheduleData, ...appointmentScheduleData];

  const days = [
    "Time",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const startHour = 8;
  const endHour = 19;

  const ROW_PX = 64;
  const MIN_TO_PX = ROW_PX / 60;

  if (scheduleLoading || appointmentLoading) {
    return (
      <Layout>
        <p className="p-6 text-gray-500">Loading schedule...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-medium text-black">Weekly Schedule</h2>
          <p className="font-medium text-[#1E1E1E80] text-sm">
            Manage your availability and working hours
          </p>
        </div>

        <button
          onClick={() => {
            setEditSlot(null);
            setOpenModal(true);
          }}
          className="bg-[#2D9AD8] text-white px-4 py-2 rounded-lg text-sm flex items-center shadow hover:bg-[#2D9AD8] transition"
        >
          <span className="text-xl mr-1">+</span> Add Slot
        </button>
      </div>

      {/* LEGEND */}
      <div className="p-4 bg-white border border-gray-200 rounded-md my-3 max-w-6xl mx-auto shadow-xl">
        <div className="flex gap-3 flex-wrap">
          <Legend label="Available" color="bg-[#2D9AD8]" />
          <Legend label="Booked Appointment" color="bg-red-500" />
          <Legend label="Confirmed Appointment" color="bg-green-500" />
          <Legend label="Break" color="bg-yellow-500" />
        </div>
      </div>

      {/* GRID */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg max-w-6xl mx-auto shadow-xl">
        <div className="grid grid-cols-[5rem_repeat(7,1fr)] border-t border-l border-gray-200">
          {/* HEADER */}
          {days.map((day, i) => (
            <div
              key={i}
              className={`font-semibold text-gray-700 text-center py-2 text-sm border-r border-b bg-gray-200
              ${day === "Time" ? "sticky left-0 bg-gray-100 z-20" : ""}
            `}
            >
              {day}
            </div>
          ))}

          {/* HOURS */}
          {Array.from({ length: endHour - startHour + 1 }).map((_, i) => {
            const hour = startHour + i;
            const rowStart = hour * 60;

            return (
              <React.Fragment key={hour}>
                {/* TIME COLUMN */}
                <div
                  className="text-gray-500 text-sm text-right pr-2 sticky left-0 bg-white border-b border-r border-gray-200 flex items-start justify-end pt-1 z-10"
                  style={{ height: ROW_PX }}
                >
                  {hour}:00
                </div>

                {/* DAYS COLUMNS */}
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const day = dayIndex + 1;

                  return (
                    <div
                      key={day}
                      className="relative border-r border-b border-gray-200"
                      style={{ height: ROW_PX }}
                    >
                      {finalScheduleData
                        .filter(
                          (s) =>
                            s &&
                            s.day === day &&
                            Math.floor(s.start / 60) * 60 === rowStart
                        )
                        .map((slot, j) => (
                          <div
                            key={j}
                            style={{
                              position: "absolute",
                              top: (slot.start - rowStart) * MIN_TO_PX,
                              left: 0,
                              right: 0,
                              height: slot.duration * MIN_TO_PX,
                            }}
                          >
                            <ScheduleSlot
                              {...slot}
                              onEdit={() => {
                                setEditSlot(slot);
                                setOpenModal(true);
                              }}
                              onDelete={() => {
                                if (
                                  !window.confirm(
                                    "Are you sure you want to delete this slot?"
                                  )
                                )
                                  return;

                                deleteMutation.mutate({
                                  doctorId,
                                  slotId: slot.slotId,
                                  payload: {
                                    day: slot.dayName,
                                    type: slot.type,
                                  },
                                });
                              }}
                            />
                          </div>
                        ))}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      <AddSlot
        open={openModal}
        onClose={() => setOpenModal(false)}
        editSlot={editSlot}
        refetch={refetch}
      />
    </Layout>
  );
}

/* ========================= LEGEND COMPONENT ========================= */
function Legend({ label, color }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white">
      <span className={`w-4 h-4 ${color} rounded-sm`} />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}
