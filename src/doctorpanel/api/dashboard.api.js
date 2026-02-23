import API from "./Api";

export const getDoctorDashboard = async (doctorId) => {
  const res = await API.get(`/dashboard/doctor/${doctorId}`);
  //console.log("Doctor Dashboard API response:", res.data);
  return res.data;
};