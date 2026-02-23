import { Routes, Route, Navigate } from "react-router-dom";
import DoctorRoutes from "./doctorpanel/routes/DoctorRoutes";
import ReceptionistRoutes from "./receptionist/routes/ReceptionistRoutes";
import ProtectedRoute from "./components/ProtectedRoute";
import { getUser, getToken } from "./utils/auth";

import DoctorLogin from "./doctorpanel/pages/auth/Login";
import ReceptionistLogin from "./receptionist/pages/auth/Login";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const token = getToken();
  const user = getUser();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <Routes>
        {/* ================= DOCTOR LOGIN ================= */}
        <Route
          path="/doctor/login"
          element={
            token && user ? (
              <Navigate to="/doctor/dashboard" replace />
            ) : (
              <DoctorLogin />
            )
          }
        />

        {/* ================= RECEPTIONIST LOGIN ================= */}
        <Route
          path="/receptionist/login"
          element={
            token && user ? (
              <Navigate to="/receptionist/dashboard" replace />
            ) : (
              <ReceptionistLogin />
            )
          }
        />

        {/* ================= DOCTOR PANEL ================= */}
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorRoutes />
            </ProtectedRoute>
          }
        />

        {/* ================= RECEPTIONIST PANEL ================= */}
        <Route
          path="/receptionist/*"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <ReceptionistRoutes />
            </ProtectedRoute>
          }
        />

        {/* ================= ROOT REDIRECT ================= */}
        <Route
          path="/"
          element={<Navigate to="/doctor/login" replace />}
        />

        {/* ================= 404 ================= */}
        <Route path="*" element={<Navigate to="/doctor/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
