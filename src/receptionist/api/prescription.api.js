import API from "./Api";
import { scaletanSuccess, scaletanError } from "../../utils/scaletan";

export const createPrescription = async (appointmentId, prescriptionData) => {
  try {
    const res = await API.post(
      `/prescription-new/prescriptions/${appointmentId}`,
      prescriptionData
    );

    return scaletanSuccess(res.data);
  } catch (error) {
    throw scaletanError(error);
  }
};


export const getPrescriptions = async (patientId) => {
  try {
    const res = await API.get(
      `/prescription-new/prescriptions/${patientId}`
    );

    return scaletanSuccess(res.data);
  } catch (error) {
    throw scaletanError(error);
  }
};

export const getAllPrescription = async () => {
  try {
    const res = await API.get(
      "prescription-new/prescriptions/getall"
    );

    return scaletanSuccess(res.data);
  } catch (error) {
    throw scaletanError(error);
  }
};
