import { Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "../pages/AdminDashboard";
import Appointments from "../pages/Appointments";
import Patients from "../pages/patients/Patients";
import PatientDetails from "../pages/patients/PatientDetails";
import AddPatient from "../pages/patients/AddPatient";
import EditPatient from "../pages/patients/EditPatient";
import Doctors from "../pages/doctor/Doctors";
import DoctorDetails from "../pages/doctor/DoctorDetails";
import Invoice from "../pages/Invoice/Invoice";
import Payments from "../pages/payments/Payments";
import AddDoctor from "../pages/doctor/AddDoctor";

const ReceptionistRoutes = () => {
  return (
    <Routes>
      {/* Protected pages */}
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="appointments" element={<Appointments />} />
      <Route path="mypatient" element={<Patients />} />
      <Route path="patient-details/:id" element={<PatientDetails />} />
      <Route path="add-patient" element={<AddPatient />} />
      <Route path="edit-patient/:id" element={<EditPatient />} />
      <Route path="doctors" element={<Doctors />} />
      <Route path="add-doctors" element={<AddDoctor />} />
      <Route path="doctor-details/:id" element={<DoctorDetails />} />
      <Route path="invoice" element={<Invoice />} />
      <Route path="payments" element={<Payments />} />

    </Routes>
  );
};

export default ReceptionistRoutes;
