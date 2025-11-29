import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

export default function CashflowLineChart({ data }) {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="divisi" /> {/* ini penting */}
          <YAxis />
          <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
          <Line
            type="monotone"
            dataKey="pemasukan"
            stroke="#4f46e5"
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="pengeluaran"
            stroke="#f43f5e"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
