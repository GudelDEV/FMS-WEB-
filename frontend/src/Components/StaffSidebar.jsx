// components/StaffSidebar.jsx
import { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  DollarOutlined,
  FileTextOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from "../Components/modal/ConfirmModal.jsx";

const { Sider } = Layout;

export default function StaffSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Handler logout
  const handleLogout = () => {
    console.log("User logged out!");
    // contoh: hapus token/session
    localStorage.removeItem("token");
    navigate("/"); // redirect ke login
    setLogoutModalOpen(false);
  };

  const menuItems = [
    {
      key: "/staff/input-transaksi",
      icon: <DollarOutlined />,
      label: <Link to="/staff/input-transaksi">Input Transaksi</Link>,
    },
    {
      key: "/staff/gaji-karyawan",
      icon: <TeamOutlined />,
      label: <Link to="/staff/gaji-karyawan">Gaji Karyawan</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: (
        <Button
          type="link"
          className="text-white p-0"
          onClick={() => setLogoutModalOpen(true)}
        >
          Logout
        </Button>
      ),
    },
  ];

  return (
    <>
      <Sider
        width={250}
        className="min-h-screen bg-gradient-to-b from-indigo-500 via-blue-500 to-sky-500 text-white shadow-xl"
      >
        <div className="text-center text-2xl font-bold py-6 tracking-wide">
          Staff / Bendahara
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="bg-transparent"
        />
      </Sider>

      {/* Modal Logout */}
      <ConfirmModal
        open={logoutModalOpen}
        title="Logout"
        message="Apakah anda yakin ingin logout?"
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalOpen(false)}
        confirmText="Logout"
        cancelText="Batal"
      />
    </>
  );
}
