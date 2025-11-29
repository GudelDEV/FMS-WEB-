import { Modal, Tag, Image, Empty } from "antd";
import moment from "moment";

export default function ReportDetailModal({ report, open, onClose }) {
  if (!report) return null;
  console.log(report);

  // Ambil gambar, fallback ke "No Image"
  const images = report.bukti
    ? Array.isArray(report.bukti)
      ? report.bukti
      : [report.bukti]
    : [];

  console.log(images);

  let statusColor = "default";
  const s = report.status?.toLowerCase();

  if (s === "pending") statusColor = "orange";
  else if (s === "approved" || s === "paid") statusColor = "green";
  else if (s === "rejected") statusColor = "red";

  return (
    <Modal
      title="Detail Laporan"
      open={open}
      onCancel={onClose}
      footer={null}
      width={650}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Staf:</strong> {report.staf}
          </div>
          <div>
            <strong>Divisi:</strong> {report.divisi}
          </div>
          <div>
            <strong>Jenis Laporan:</strong> {report.jenis}
          </div>
          <div>
            <strong>Nominal:</strong> Rp {report.nominal.toLocaleString()}
          </div>
          <div>
            <strong>Tanggal:</strong>{" "}
            {moment(report.tanggal).format("DD MMMM YYYY")}
          </div>
          <div>
            <strong>Status:</strong>{" "}
            <Tag color={statusColor}>{report.status}</Tag>
          </div>
        </div>

        <div>
          <strong>Catatan:</strong>
          <p className="pl-2">{report.catatan || "-"}</p>
        </div>

        <div>
          <strong>Bukti / Lampiran:</strong>
          <div className="flex flex-wrap gap-2 mt-2">
            {images.length > 0 ? (
              images.map((img, i) => (
                <Image
                  key={i}
                  src={`http://localhost:5000/imageBook/${img}`}
                  width={120}
                  height={120}
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                  fallback="https://via.placeholder.com/120x120?text=No+Image"
                />
              ))
            ) : (
              <Empty description="No Image" />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
