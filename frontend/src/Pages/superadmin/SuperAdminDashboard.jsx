/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from "react";
import axios from "axios";
import FilterPeriode from "../../Components/FilterPeriode";
import BarDivisiChart from "../../Components/charts/BarDivisiChart";
import CashflowLineChart from "../../Components/charts/CashflowLineChart";
import SummaryCard from "../../Components/cards/SummaryCard";
import { Button } from "antd";

export default function SuperAdminDashboard() {
  const [periode, setPeriode] = useState("monthly");
  const [chartType, setChartType] = useState("bar");
  const [data, setData] = useState({
    totalPemasukan: 0,
    totalPengeluaran: 0,
    totalGaji: 0,
    saldo: 0,
    perDivisi: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, [periode]);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/dashboard/finance?periode=${periode}`
      );
      console.log(res);

      setData(res.data);
    } catch (err) {
      console.log("Gagal fetch dashboard", err);
    }
  };
  console.log("perDivisi:", data);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Dashboard Keuangan</h1>
        <FilterPeriode periode={periode} onChange={setPeriode} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <SummaryCard
          title="Total Pemasukan"
          value={`Rp ${data.totalPemasukan.toLocaleString()}`}
          className="border-green-500 text-green-600"
        />
        <SummaryCard
          title="Total Pengeluaran"
          value={`Rp ${data.totalPengeluaran.toLocaleString()}`}
          className="border-red-500 text-red-600"
        />
        <SummaryCard
          title="Total Gaji"
          value={`Rp ${data.totalGaji.toLocaleString()}`}
          className="border-purple-500 text-purple-600"
        />
        <SummaryCard
          title="Saldo / Cashflow"
          value={`Rp ${data.saldo.toLocaleString()}`}
          className="border-blue-500 text-blue-600"
        />
      </div>

      {/* Chart Toggle */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          type={chartType === "bar" ? "primary" : "default"}
          onClick={() => setChartType("bar")}
        >
          Grafik Pemasukan & Pengeluaran
        </Button>

        <Button
          type={chartType === "cashflow" ? "primary" : "default"}
          onClick={() => setChartType("cashflow")}
        >
          Cashflow Timeline
        </Button>
      </div>

      {/* Chart */}
      {chartType === "bar" ? (
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Grafik Pemasukan & Pengeluaran (Per Divisi)
          </h2>
          <BarDivisiChart data={data.perDivisi} />
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cashflow Timeline</h2>
          <CashflowLineChart data={data.perDivisi} />
        </div>
      )}
    </>
  );
}
