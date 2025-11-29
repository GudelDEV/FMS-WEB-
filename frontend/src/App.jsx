import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/superadmin/Login";
import { ToastContainer } from "react-toastify";
// Layout
import SuperAdminLayout from "./Components/SuperAdminLayout";
import StaffLayout from "./Components/StaffLayout";
// Pages
import Dashboard from "./Pages/superadmin/SuperAdminDashboard";
import ManageUsers from "./Pages/superadmin/ManageUser";
import FinanceData from "./Pages/superadmin/FinanceData";
import DataKaryawan from "./Pages/superadmin/DataKaryawan";
import ReportsPages from "./Pages/superadmin/Reports";
import InputTransaction from "./Pages/staf/InputTransaction";
import GajiKaryawanBendahara from "./Pages/staf/GajiKaryawanBendahara";
import DivisiContent from "./Pages/superadmin/DivisiPage";
import NotFound from "./Pages/NotfoundPage";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
export default function App() {
  return (
    <>
      {/* ToastContainer ditempatkan di root */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        {/* LOGIN PAGE */}
        <Route path="/" element={<Login />} />

        {/* SUPER ADMIN ROUTES */}
        <Route path="/superadmin" element={<SuperAdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="division" element={<DivisiContent />} />
          <Route path="finance-data" element={<FinanceData />} />
          <Route path="data-karyawan" element={<DataKaryawan />} />
          <Route path="reports" element={<ReportsPages />} />
        </Route>

        {/* STAFF ROUTES */}
        <Route path="/staff" element={<StaffLayout />}>
          {/* redirect default ke input-transaksi */}
          <Route index element={<Navigate to="input-transaksi" replace />} />

          <Route path="input-transaksi" element={<InputTransaction />} />
          <Route path="gaji-karyawan" element={<GajiKaryawanBendahara />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
