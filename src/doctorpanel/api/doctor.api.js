// doctor.api.js
import API from "./Api";

export const addDoctor = async (payload) => {
  const res = await API.post("/doctor-new", payload);
  return res.data;
};

export const doctorData = async () => {
  const res = await API.get("/doctor-new");
  return res.data.data ?? [];
};

export const doctorById = async (doctorId) => {
  const res = await API.get(`/doctor-new/${doctorId}`);
  return res.data.data;
};
