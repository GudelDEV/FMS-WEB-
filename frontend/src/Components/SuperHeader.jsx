// components/SuperHeader.jsx
import { Layout, Avatar } from 'antd';

const { Header } = Layout;

export default function SuperHeader({ text = 'Citra (Super Admin)', image = 'C' }) {
  return (
    <Header className="bg-white shadow-md flex justify-between items-center px-6">
      <h1 className="text-xl font-semibold text-white tracking-wide">Finance Management System — Super Admin</h1>

      <div className="flex items-center gap-3">
        <span className="font-medium text-white">{text}</span>
        <Avatar className="bg-cyan-500">{image}</Avatar>
      </div>
    </Header>
  );
}
