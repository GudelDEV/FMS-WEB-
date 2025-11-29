/*
  Warnings:

  - Added the required column `buktiTransaksi` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gajitransaksi` ADD COLUMN `buktiPembayaran` VARCHAR(191) NULL,
    ADD COLUMN `tanggalDibayar` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `buktiTransaksi` VARCHAR(191) NOT NULL;
