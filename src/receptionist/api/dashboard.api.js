import API from "./Api";

export const getReceptionistDashboard = async ({ period, startDate, endDate }) => {
  const params = { period };

  if (period === "custom") {
    params.start = startDate;
    params.end = endDate;
  }

  const res = await API.get("/dashboard/receptionist", { params });
  //console.log("API response:", res.data);

  return res.data; // ✅ return the full response
};
