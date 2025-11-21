import { useState } from 'react';
import { Table, Button, Tag, Input, DatePicker } from 'antd';
import moment from 'moment';
import SummaryCard from '../../Components/cards/SummaryCard';
import ReportDetailModal from '../../Components/ReportDetailModal';

const { MonthPicker, RangePicker } = DatePicker;

const dummyReports = [
  {
    id: 1,
    staf: 'Andi Saputra',
    divisi: 'Finance',
    jenis: 'Pemasukan',
    nominal: 5000000,
    tanggal: moment('2025-11-01', 'YYYY-MM-DD'),
    status: 'Pending',
    catatan: 'Gaji bulan November belum dibayar sebagian',
  },
  {
    id: 2,
    staf: 'Budi Prakoso',
    divisi: 'HRD',
    jenis: 'Pengeluaran',
    nominal: 1200000,
    tanggal: moment('2025-11-03', 'YYYY-MM-DD'),
    status: 'Approved',
    catatan: 'Pembayaran listrik kantor bulan November',
  },
  {
    id: 3,
    staf: 'Ani Wijaya',
    divisi: 'Operasional',
    jenis: 'Pengeluaran',
    nominal: 300000,
    tanggal: moment('2025-11-04', 'YYYY-MM-DD'),
    status: 'Rejected',
    catatan: 'Salah input nominal',
  },
];

export default function ReportsPages() {
  const [reports, setReports] = useState(dummyReports);
  const [searchText, setSearchText] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [monthFilter, setMonthFilter] = useState(null);
  const [yearFilter, setYearFilter] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  // Summary
  const totalReports = reports.length;
  const totalNominal = reports.reduce((sum, r) => sum + r.nominal, 0);
  const pendingCount = reports.filter((r) => r.status === 'Pending').length;
  const approvedCount = reports.filter((r) => r.status === 'Approved').length;
  const rejectedCount = reports.filter((r) => r.status === 'Rejected').length;

  // Filtered Data Realtime dengan log
  const filteredData = reports.filter((r) => {
    const reportDate = r.tanggal;

    console.log('--- Filtering Report ---');
    console.log('Report date:', reportDate, 'Type:', typeof reportDate);

    // Search filter
    const matchSearch =
      r.staf.toLowerCase().includes(searchText.toLowerCase()) ||
      r.divisi.toLowerCase().includes(searchText.toLowerCase()) ||
      r.jenis.toLowerCase().includes(searchText.toLowerCase());

    console.log('matchSearch:', matchSearch);

    // Month filter
    const matchMonth = monthFilter ? reportDate.month() === monthFilter.month() : true;
    console.log('MonthPicker value:', monthFilter, 'matchMonth:', matchMonth);

    // Year filter
    const matchYear = yearFilter ? reportDate.year() === yearFilter.year() : true;
    console.log('YearPicker value:', yearFilter, 'matchYear:', matchYear);

    // Range filter
    const matchRange = dateRange
      ? reportDate.format('YYYY-MM-DD') >= dateRange[0].format('YYYY-MM-DD') &&
        reportDate.format('YYYY-MM-DD') <= dateRange[1].format('YYYY-MM-DD')
      : true;

    return matchSearch && matchMonth && matchYear && matchRange;
  });

  // Approve / Reject
  const handleApprove = (id) => {
    setReports(reports.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r)));
  };
  const handleReject = (id) => {
    setReports(reports.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r)));
  };

  // Table Columns
  const columns = [
    { title: 'Staf', dataIndex: 'staf', key: 'staf' },
    { title: 'Divisi', dataIndex: 'divisi', key: 'divisi' },
    { title: 'Jenis', dataIndex: 'jenis', key: 'jenis' },
    {
      title: 'Nominal',
      dataIndex: 'nominal',
      key: 'nominal',
      render: (v) => `Rp ${v.toLocaleString()}`,
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
      render: (date) => date.format('YYYY-MM-DD'),
    },
    {
      title: 'Bulan',
      key: 'bulan',
      render: (_, record) => record.tanggal.format('MMMM'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'Pending' ? 'orange' : status === 'Approved' ? 'green' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Aksi',
      key: 'aksi',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="default"
            onClick={() => {
              setSelectedReport(record);
              setOpenModal(true);
            }}
          >
            Detail
          </Button>
          {record.status === 'Pending' && (
            <>
              <Button
                type="primary"
                style={{ backgroundColor: 'green', borderColor: 'green' }}
                onClick={() => handleApprove(record.id)}
              >
                Approve
              </Button>
              <Button
                danger
                onClick={() => handleReject(record.id)}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-indigo-600 mb-5">Reports / Laporan</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Total Laporan"
          value={totalReports}
          className="border-indigo-500"
        />
        <SummaryCard
          title="Total Nominal"
          value={`Rp ${totalNominal.toLocaleString()}`}
          className="border-blue-500"
        />
        <SummaryCard
          title="Pending"
          value={pendingCount}
          className="border-orange-500"
        />
        <SummaryCard
          title="Approved"
          value={approvedCount}
          className="border-green-500"
        />
        <SummaryCard
          title="Rejected"
          value={rejectedCount}
          className="border-red-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <Input
          placeholder="Cari laporan..."
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <MonthPicker
          placeholder="Pilih Bulan"
          value={monthFilter}
          onChange={(date) => {
            console.log('MonthPicker onChange:', date, 'Type:', typeof date);
            setMonthFilter(date ? moment(date) : null);
          }}
          format="MMMM YYYY"
        />
        <DatePicker
          picker="year"
          placeholder="Pilih Tahun"
          value={yearFilter}
          onChange={(date) => {
            console.log('YearPicker onChange:', date, 'Type:', typeof date);
            setYearFilter(date ? moment(date) : null);
          }}
        />
        <RangePicker
          value={dateRange}
          onChange={(dates) => {
            console.log('RangePicker onChange:', dates);
            if (dates) {
              console.log('Start date type:', typeof dates[0], 'value:', dates[0]);
              console.log('End date type:', typeof dates[1], 'value:', dates[1]);
            }
            setDateRange(dates);
          }}
          format="YYYY-MM-DD"
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        className="bg-white p-4 rounded-xl shadow"
      />

      {/* Modal Detail */}
      <ReportDetailModal
        report={selectedReport}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
