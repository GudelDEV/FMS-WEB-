import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/superadmin/Login';

// Layout
import SuperAdminLayout from './Components/SuperAdminLayout';
import StaffLayout from './Components/StaffLayout';
// Pages
import Dashboard from './Pages/superadmin/SuperAdminDashboard';
import ManageUsers from './Pages/superadmin/ManageUser';
import FinanceData from './Pages/superadmin/FinanceData';
import DataKaryawan from './Pages/superadmin/DataKaryawan';
import ReportsPages from './Pages/superadmin/Reports';
import InputTransaction from './Pages/staf/InputTransaction';
import GajiKaryawanBendahara from './Pages/staf/GajiKaryawanBendahara';
export default function App() {
  return (
    <Routes>
      {/* LOGIN PAGE */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* SUPER ADMIN ROUTES */}
      <Route
        path="/superadmin"
        element={<SuperAdminLayout />}
      >
        <Route
          path="dashboard"
          element={<Dashboard />}
        />
        <Route
          path="manage-users"
          element={<ManageUsers />}
        />
        <Route
          path="finance-data"
          element={<FinanceData />}
        />
        <Route
          path="data-karyawan"
          element={<DataKaryawan />}
        />
        <Route
          path="reports"
          element={<ReportsPages />}
        />
      </Route>

      {/* STAFF ROUTES */}
      <Route
        path="/staff"
        element={<StaffLayout />}
      >
        {/* redirect default ke input-transaksi */}
        <Route
          index
          element={
            <Navigate
              to="input-transaksi"
              replace
            />
          }
        />

        <Route
          path="input-transaksi"
          element={<InputTransaction />}
        />
        <Route
          path="gaji-karyawan"
          element={<GajiKaryawanBendahara />}
        />
      </Route>
    </Routes>
  );
}
