import API from "./Api";
import { scaletanSuccess, scaletanError } from "../../utils/scaletan";

export const getAllInvoices = async () => {
  try {
    const res = await API.get("/invoice-new/getall");
    return scaletanSuccess(res.data);
  } catch (error) {
    throw scaletanError(error);
  }
};

export const createInvoice = async (prescriptionId, prescriptionData) => {
  try {
    const res = await API.post(
      `/invoice-new/prescriptions/${prescriptionId}/invoice`,
      prescriptionData
    );

    return scaletanSuccess(res.data);
  } catch (error) {
    throw scaletanError(error);
  }
};
