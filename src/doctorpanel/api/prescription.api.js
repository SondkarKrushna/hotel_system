import API from "./Api";
import { scaletanSuccess, scaletanError } from "../../utils/scaletan";

export const createPrescription = async (patientId, prescriptionData) => {
  try {
    const res = await API.post(
      `/prescription-new/prescriptions/${patientId}`,
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
