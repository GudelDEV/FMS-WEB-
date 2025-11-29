import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

export default function BarDivisiChart({ data }) {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="divisi" /> {/* ini penting */}
          <YAxis />
          <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
          <Bar dataKey="pemasukan" fill="#4f46e5" />
          <Bar dataKey="pengeluaran" fill="#f43f5e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
