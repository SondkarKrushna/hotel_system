import API from "./Api";

export const postAppointment = async (appointmentData) => {
  const res = await API.post("/appointment-new", appointmentData);
  //console.log("Create Appointment RESPONSE:", res.data);
  return res.data.data;
};

export const getAppointments = async (doctorId, payload) => {
  const res = await API.get(`/appointment-new/doctor/${doctorId}`, {
    params: payload,
  });
  return res.data;
};



export const getAppointmentById = async (appointmentId) => {
  const res = await API.get(`/appointment-new/${appointmentId}`);
  return res.data.data;
};

export const getTimeSlots = async (doctorId, appointmentDate) => {
  const res = await API.get(`/doctor-new/${doctorId}/slots?date=${appointmentDate}`);
  return res.data.data ?? [];
};
// APPROVE
export const approveAppointment = async (appointmentId) => {
  const { data } = await APIs.put(`/appointments/${appointmentId}/approve`);
  return data;
};

// REJECT
export const rejectAppointment = async (appointmentId, reason) => {
  const { data } = await APIs.put(`/appointments/${appointmentId}/reject`, { reason });
  return data;
};

// RESCHEDULE
export const rescheduleAppointment = async (appointmentId, payload) => {
  const { data } = await APIs.put(`/appointments/${appointmentId}/reschedule`, payload);
  return data;
};

// TRANSFER
export const transferAppointment = async (appointmentId, newDoctorId) => {
  const { data } = await APIs.put(`/appointments/${appointmentId}/transfer`, { newDoctorId });
  return data;
};