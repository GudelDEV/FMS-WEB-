// components/SuperAdminLayout.jsx
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import SuperSidebar from "./SuperSidebar";
import SuperHeader from "./SuperHeader";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const { Content } = Layout;

export default function SuperAdminLayout() {
  const navigate = useNavigate();

  // Cek token saat pertama render
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Kalau token tidak ada, redirect ke login
      navigate("/");
    }
  }, [navigate]);
  return (
    <Layout>
      <SuperSidebar />
      <Layout>
        <SuperHeader />
        <Content className="p-6 bg-gray-100 min-h-screen">
          <Outlet /> {/* <-- INI WAJIB */}
        </Content>
      </Layout>
    </Layout>
  );
}
