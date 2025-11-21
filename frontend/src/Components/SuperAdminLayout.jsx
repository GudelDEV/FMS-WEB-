// components/SuperAdminLayout.jsx
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import SuperSidebar from './SuperSidebar';
import SuperHeader from './SuperHeader';

const { Content } = Layout;

export default function SuperAdminLayout() {
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
