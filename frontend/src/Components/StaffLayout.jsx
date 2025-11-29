import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import StaffSidebar from "./StaffSidebar.jsx";
import SuperHeader from "./SuperHeader.jsx";
import axios from "axios";

const { Content } = Layout;

export default function StaffLayout() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Jika tidak ada token → redirect ke login
    if (!token) {
      navigate("/");
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "http://localhost:5000/api/login/staff-info",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCurrentUser(res.data.user);
      } catch (err) {
        console.error("Error fetch staff-info:", err);

        // Jika token invalid / expired → keluarin user
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    // PANGGIL YANG BENAR
    fetchCurrentUser();
  }, [navigate]);

  return (
    <Layout>
      <StaffSidebar />
      <Layout>
        <SuperHeader
          image={currentUser?.name?.charAt(0) || "U"}
          text={
            currentUser
              ? `${currentUser.name} (${currentUser.role.toUpperCase()})`
              : "Loading..."
          }
          role={"STAFF"}
        />
        <Content className="p-6 bg-gray-100 min-h-screen">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
