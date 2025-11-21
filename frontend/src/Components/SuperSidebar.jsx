// components/SuperSidebar.jsx
import { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  AppstoreOutlined, // ikon untuk Division
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ConfirmModal from '../Components/modal/ConfirmModal.jsx';

const { Sider } = Layout;

export default function SuperSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Handler untuk logout
  const handleLogout = () => {
    console.log('User logged out!');
    navigate('/'); // redirect ke login page
    setLogoutModalOpen(false);
  };

  const menuItems = [
    {
      key: '/superadmin/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/superadmin/dashboard">Dashboard</Link>,
    },
    {
      key: '/superadmin/manage-users',
      icon: <UserOutlined />,
      label: <Link to="/superadmin/manage-users">Manage Users</Link>,
    },
    {
      key: '/superadmin/data-karyawan',
      icon: <TeamOutlined />,
      label: <Link to="/superadmin/data-karyawan">Data Karyawan</Link>,
    },
    {
      key: '/superadmin/division', // ← NEW menu Division
      icon: <AppstoreOutlined />,
      label: <Link to="/superadmin/division">Division</Link>,
    },
    {
      key: '/superadmin/finance-data',
      icon: <DatabaseOutlined />,
      label: <Link to="/superadmin/finance-data">Finance Data</Link>,
    },
    {
      key: '/superadmin/reports',
      icon: <BarChartOutlined />,
      label: <Link to="/superadmin/reports">Reports</Link>,
    },
    {
      key: 'logout',
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
        <div className="text-center text-2xl font-bold py-6 tracking-wide">Super Admin</div>

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
