import API from "./Api"; // your axios instance

export const getScheduleData = async (doctorId) => {
  const res = await API.get(`/doctor-slots/${doctorId}/slots`);
  return res.data.data;
};

export const addScheduleSlot = async ({ doctorId, payload }) => {
  const res = await API.post(`/doctor-slots/${doctorId}/slots`, payload);
  return res.data;
};

export const updateScheduleSlot = async ({ doctorId, slotId, payload }) => {
  const res = await API.put(`/doctor-slots/${doctorId}/slots/${slotId}`, payload);
  return res.data;
};
export const deleteDoctorSlot = async ({ doctorId, slotId, payload }) => {
  const res = await API.delete(`/doctor-slots/${doctorId}/slots/${slotId}`, {
    data: payload, // ✅ important (DELETE body)
  });

  return res.data;
};
