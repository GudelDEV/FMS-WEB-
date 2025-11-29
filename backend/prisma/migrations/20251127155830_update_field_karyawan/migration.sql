/*
  Warnings:

  - Added the required column `addres` to the `Karyawan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Karyawan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Karyawan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posisi` to the `Karyawan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `karyawan` ADD COLUMN `addres` VARCHAR(191) NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `posisi` VARCHAR(191) NOT NULL;
