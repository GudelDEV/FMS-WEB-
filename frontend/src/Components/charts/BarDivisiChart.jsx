import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

export default function BarDivisiChart({ data }) {
  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Bar
            dataKey="pemasukan"
            fill="#4f46e5"
          />
          <Bar
            dataKey="pengeluaran"
            fill="#f43f5e"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
