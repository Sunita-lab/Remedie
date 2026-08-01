import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminDashboard from "@/pages/AdminDashboard";
import PatientDashboard from "@/pages/PatientDashboard";
import DoctorDashboard from "@/pages/DoctorDashboard";
import Appointments from "@/pages/patient/Appointments";
import DoctorAppointments from "@/pages/doctor/Appointments";
import MedicalRecords from "@/pages/patient/MedicalRecords";
import Prescriptions from "@/pages/patient/Prescriptions";
import Billing from "@/pages/patient/Billing";
import AdminBilling from "@/pages/admin/Billing";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
         path="/patient/appointments"
         element={
        <ProtectedRoute allowedRoles={["patient"]}>
          <Appointments />
        </ProtectedRoute>
       }
      />
      <Route
  path="/doctor/appointments"
  element={
    <ProtectedRoute allowedRoles={["doctor"]}>
      <DoctorAppointments />
    </ProtectedRoute>
  }
/>
<Route
  path="/patient/records"
  element={
    <ProtectedRoute allowedRoles={["patient"]}>
      <MedicalRecords />
    </ProtectedRoute>
  }
/>
<Route
  path="/patient/prescriptions"
  element={
    <ProtectedRoute allowedRoles={["patient"]}>
      <Prescriptions />
    </ProtectedRoute>
  }
/>
<Route
  path="/patient/billing"
  element={
    <ProtectedRoute allowedRoles={["patient"]}>
      <Billing />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/billing"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminBilling />
    </ProtectedRoute>
  }
/>
      </Routes>
    </>
  );
}

export default App;