/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from "react";
import { Table, Button, Tag, Input, DatePicker, Space } from "antd";
import moment from "moment";
import SummaryCard from "../../Components/cards/SummaryCard";
import ReportDetailModal from "../../Components/ReportDetailModal";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
const { MonthPicker, RangePicker } = DatePicker;

export default function ReportsPages() {
  const [reports, setReports] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [monthFilter, setMonthFilter] = useState(null);
  const [yearFilter, setYearFilter] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports");
      const data = res.data.map((r) => ({
        ...r,
        tanggal: moment(r.tanggal), // convert to moment
      }));
      console.log(data);

      setReports(data);
    } catch (err) {
      console.log("Error fetching reports", err);
    }
  };

  // Summary
  const totalReports = reports.length;
  const totalNominal = reports.reduce((sum, r) => sum + r.nominal, 0);
  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const approvedCount = reports.filter((r) => r.status === "approved").length;
  const rejectedCount = reports.filter((r) => r.status === "rejected").length;

  // Filtered Data Realtime dengan log
  const filteredData = reports.filter((r) => {
    const reportDate = r.tanggal;

    console.log("--- Filtering Report ---");
    console.log("Report date:", reportDate, "Type:", typeof reportDate);

    // Search filter
    const matchSearch =
      r.staf.toLowerCase().includes(searchText.toLowerCase()) ||
      r.divisi.toLowerCase().includes(searchText.toLowerCase()) ||
      r.jenis.toLowerCase().includes(searchText.toLowerCase());

    console.log("matchSearch:", matchSearch);

    // Month filter
    const matchMonth = monthFilter
      ? reportDate.month() === monthFilter.month()
      : true;
    console.log("MonthPicker value:", monthFilter, "matchMonth:", matchMonth);

    // Year filter
    const matchYear = yearFilter
      ? reportDate.year() === yearFilter.year()
      : true;
    console.log("YearPicker value:", yearFilter, "matchYear:", matchYear);

    // Range filter
    const matchRange = dateRange
      ? reportDate.format("YYYY-MM-DD") >= dateRange[0].format("YYYY-MM-DD") &&
        reportDate.format("YYYY-MM-DD") <= dateRange[1].format("YYYY-MM-DD")
      : true;

    return matchSearch && matchMonth && matchYear && matchRange;
  });

  // Table Columns
  const columns = [
    { title: "Staf", dataIndex: "staf", key: "staf" },
    { title: "Divisi", dataIndex: "divisi", key: "divisi" },
    { title: "Jenis", dataIndex: "jenis", key: "jenis" },
    {
      title: "Nominal",
      dataIndex: "nominal",
      key: "nominal",
      render: (v) => `Rp ${v.toLocaleString()}`,
    },
    {
      title: "Tanggal",
      dataIndex: "tanggal",
      key: "tanggal",
      render: (date) => date.format("YYYY-MM-DD"),
    },
    {
      title: "Bulan",
      key: "bulan",
      render: (_, record) => record.tanggal.format("MMMM"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "pending"
            ? "orange"
            : status === "approved" || status === "paid"
            ? "green"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Aksi",
      key: "aksi",
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

          {/* Tombol approve/reject hanya untuk transaksi, bukan gaji */}
          {record.status === "pending" && record.jenis !== "Gaji" && (
            <>
              <Button
                type="primary"
                style={{ backgroundColor: "green", borderColor: "green" }}
                onClick={() => handleApprove(record.id)}
              >
                Approve
              </Button>
              <Button danger onClick={() => handleReject(record.id)}>
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  // Approve / Reject
  const handleApprove = async (id, jenis) => {
    const realId = Number(id.split("-")[1]);

    await axios.put(`http://localhost:5000/api/reports/approve/${realId}`, {
      jenis, // "Gaji" atau "Transaksi"
    });

    fetchReports(); // refresh data
  };

  const handleReject = async (id, jenis) => {
    const realId = Number(id.split("-")[1]);

    await axios.put(`http://localhost:5000/api/reports/reject/${realId}`, {
      jenis,
    });

    fetchReports();
  };
  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    // autoTable sekarang dipanggil dari autoTable(), bukan doc.autoTable()
    autoTable(doc, {
      head: [["Staf", "Divisi", "Jenis", "Nominal", "Tanggal", "Status"]],
      body: filteredData.map((r) => [
        r.staf,
        r.divisi,
        r.jenis,
        r.nominal.toLocaleString(),
        r.tanggal.format("YYYY-MM-DD"),
        r.status,
      ]),
    });

    doc.save("reports.pdf");
  };
  // Export Excel
  const exportExcel = () => {
    const wsData = filteredData.map((r) => ({
      Staf: r.staf,
      Divisi: r.divisi,
      Jenis: r.jenis,
      Nominal: r.nominal,
      Tanggal: r.tanggal.format("YYYY-MM-DD"),
      Status: r.status,
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, `laporan_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-indigo-600 mb-5">
        Reports / Laporan
      </h1>

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
            console.log("MonthPicker onChange:", date, "Type:", typeof date);
            setMonthFilter(date ? moment(date) : null);
          }}
          format="MMMM YYYY"
        />
        <DatePicker
          picker="year"
          placeholder="Pilih Tahun"
          value={yearFilter}
          onChange={(date) => {
            console.log("YearPicker onChange:", date, "Type:", typeof date);
            setYearFilter(date ? moment(date) : null);
          }}
        />
        <RangePicker
          value={dateRange}
          onChange={(dates) => {
            console.log("RangePicker onChange:", dates);
            if (dates) {
              console.log(
                "Start date type:",
                typeof dates[0],
                "value:",
                dates[0]
              );
              console.log(
                "End date type:",
                typeof dates[1],
                "value:",
                dates[1]
              );
            }
            setDateRange(dates);
          }}
          format="YYYY-MM-DD"
        />
      </div>

      <Space className="mb-4">
        <Button type="primary" onClick={exportPDF}>
          Export PDF
        </Button>
        <Button type="default" onClick={exportExcel}>
          Export Excel
        </Button>
      </Space>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
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
