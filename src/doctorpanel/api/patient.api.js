import API from "./Api";

export const patientData = async ({  }) => {

  const res = await API.get("/patient-new");

  ////console.log("API RESPONSE:", res.data);

  return res.data.data ?? [];
};

export const patientById = async (patientId) => {
  const res = await API.get(`/patient-new/${patientId}`);
  return res.data.data;
};

export const createPatient = async (patientData) => {
  const res = await API.post("/patient-new", patientData);
  //console.log("Create Patient RESPONSE:", res.data);
  return res.data.data;
};

export const updatePatient = async (patientId, patientData) => {
  const res = await API.put(`/patient-new/${patientId}`, patientData);
  return res.data.data;
};
