import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import StaffSidebar from './StaffSidebar.jsx';
import SuperHeader from './SuperHeader.jsx';

const { Content } = Layout;

export default function StaffLayout() {
  return (
    <Layout>
      <StaffSidebar />
      <Layout>
        <SuperHeader
          image="A"
          text="Anggi (Staff Admin)"
        />
        <Content className="p-6 bg-gray-100 min-h-screen">
          <Outlet /> {/* konten halaman akan masuk di sini */}
        </Content>
      </Layout>
    </Layout>
  );
}
