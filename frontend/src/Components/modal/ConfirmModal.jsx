// components/ConfirmModal.jsx
import React from 'react';
import { Modal, Button } from 'antd';

export default function ConfirmModal({
  open = false, // status modal terbuka
  title = 'Konfirmasi', // judul modal
  message = 'Apakah anda yakin?', // pesan
  onConfirm, // fungsi saat klik Confirm
  onCancel, // fungsi saat klik Cancel / close
  confirmText = 'Ya', // teks tombol Confirm
  cancelText = 'Batal', // teks tombol Cancel
}) {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmText}
      cancelText={cancelText}
      centered
    >
      <p>{message}</p>
    </Modal>
  );
}
