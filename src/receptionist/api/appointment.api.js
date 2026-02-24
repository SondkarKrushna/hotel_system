import API from "./Api";

export const postAppointment = async (appointmentData) => {
  const res = await API.post("/appointment-new", appointmentData);
  //console.log("Create Appointment RESPONSE:", res.data);
  return res.data.data;
};

export const getAppointments = async (
  period = "today",
  startDate = null,
  endDate = null
) => {
  const res = await API.get("/appointment-new/appointments", {
    params: {
      period,
      ...(period === "custom" && startDate && endDate
        ? { startDate, endDate }
        : {}),
    },
  });

  return res.data.data ?? [];
};

export const getAppointmentById = async (appointmentId) => {
  const res = await API.get(`/appointment-new/${appointmentId}`);
  return res.data.data;
};

export const getTimeSlots = async (doctorId, appointmentDate) => {
  const res = await API.get(`/doctor-new/${doctorId}/slots?date=${appointmentDate}`);
  return res.data.data ?? [];
};
