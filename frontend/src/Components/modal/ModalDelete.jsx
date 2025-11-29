import { Modal, Button } from "antd";

export default function ModalDelete({ open, onCancel, onConfirm, name }) {
  return (
    <Modal
      title="Konfirmasi Hapus"
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <p className="text-base">
        Apakah kamu yakin ingin menghapus data <b>{name}</b>?
      </p>

      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onCancel}>Batal</Button>

        <Button danger type="primary" onClick={onConfirm}>
          Hapus
        </Button>
      </div>
    </Modal>
  );
}
