/*
  Warnings:

  - You are about to alter the column `buktiTransaksi` on the `transaksi` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `transaksi` MODIFY `buktiTransaksi` JSON NULL;
