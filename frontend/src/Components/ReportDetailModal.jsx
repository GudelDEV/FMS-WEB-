import { Modal, Tag, Image } from 'antd';

export default function ReportDetailModal({ report, open, onClose }) {
  if (!report) return null;

  // Dummy images untuk laporan
  const images = report.images || [
    'https://source.unsplash.com/random/400x300?receipt',
    'https://source.unsplash.com/random/400x300?invoice',
  ];

  let statusColor = 'default';
  if (report.status === 'Pending') statusColor = 'orange';
  else if (report.status === 'Approved') statusColor = 'green';
  else if (report.status === 'Rejected') statusColor = 'red';

  return (
    <Modal
      title="Detail Laporan"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div className="space-y-3">
        <p>
          <strong>Staf:</strong> {report.staf}
        </p>
        <p>
          <strong>Divisi:</strong> {report.divisi}
        </p>
        <p>
          <strong>Jenis Laporan:</strong> {report.jenis}
        </p>
        <p>
          <strong>Nominal:</strong> Rp {report.nominal.toLocaleString()}
        </p>
        <p>
          <strong>Tanggal:</strong> {report.tanggal}
        </p>
        <p>
          <strong>Status:</strong> <Tag color={statusColor}>{report.status}</Tag>
        </p>
        <p>
          <strong>Catatan:</strong> {report.catatan}
        </p>

        <div>
          <strong>Bukti / Lampiran:</strong>
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((img, i) => (
              <Image
                key={i}
                src={img}
                width={100}
                height={100}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
