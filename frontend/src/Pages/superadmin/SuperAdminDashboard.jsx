import { useState } from 'react';

import FilterPeriode from '../../Components/FilterPeriode';
import BarDivisiChart from '../../Components/charts/BarDivisiChart';
import CashflowLineChart from '../../Components/charts/CashflowLineChart';
import SummaryCard from '../../Components/cards/SummaryCard';
import { Button } from 'antd';

import { financeData } from '../../data/financeDummy';

export default function SuperAdminDashboard() {
  const [periode, setPeriode] = useState('monthly');
  const [chartType, setChartType] = useState('bar');

  const data = financeData[periode]; // artinya kamu mengambil data berdasarkan key di object financeData.

  console.log(data);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Dashboard Keuangan</h1>
        <FilterPeriode
          periode={periode}
          onChange={setPeriode}
        />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SummaryCard
          title="Total Pemasukan"
          value="Rp 128.000.000"
          className="border-green-500 text-green-600"
        />

        <SummaryCard
          title="Total Pengeluaran"
          value="Rp 62.000.000"
          className="border-red-500 text-red-600"
        />

        <SummaryCard
          title="Saldo / Cashflow"
          value="Rp 66.000.000"
          className="border-blue-500 text-blue-600"
        />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Button
          type={chartType === 'bar' ? 'primary' : 'default'}
          onClick={() => setChartType('bar')}
        >
          Grafik Pemasukan & Pengeluaran
        </Button>

        <Button
          type={chartType === 'cashflow' ? 'primary' : 'default'}
          onClick={() => setChartType('cashflow')}
        >
          Cashflow Timeline
        </Button>
      </div>

      {chartType === 'bar' ? (
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Grafik Pemasukan & Pengeluaran (Per Divisi)</h2>
          <BarDivisiChart data={data} />
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cashflow Timeline</h2>
          <CashflowLineChart data={data} />
        </div>
      )}
    </>
  );
}
