import { Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "../pages/AdminDashboard";
import Appointments from "../pages/Appointments/Appointments";
import Patients from "../pages/patients/Patients";
import PatientDetails from "../pages/patients/PatientDetails";
import AddPatient from "../pages/patients/AddPatient";
import EditPatient from "../pages/patients/EditPatient";
import Doctors from "../pages/doctor/Doctors";
import DoctorDetails from "../pages/doctor/DoctorDetails";
import Prescriptions from "../pages/prescriptions/Prescription";
import WeeklySchedule from "../pages/schedule/WeeklySchedule";
import Invoice from "../pages/Invoice/Invoice";

const DoctorRoutes = () => {
  return (
    <Routes>

      {/* Doctor pages */}
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="appointments" element={<Appointments />} />
      <Route path="mypatient" element={<Patients />} />
      <Route path="patient-details/:id" element={<PatientDetails />} />
      <Route path="add-patient" element={<AddPatient />} />
      <Route path="edit-patient/:id" element={<EditPatient />} />
      <Route path="doctors" element={<Doctors />} />
      <Route path="doctor-details/:id" element={<DoctorDetails />} />
      <Route path="schedule" element={<WeeklySchedule />} />
      <Route path="invoice" element={<Invoice />} />
      <Route path="prescription" element={<Prescriptions />} />

    </Routes>
  );
};

export default DoctorRoutes;
