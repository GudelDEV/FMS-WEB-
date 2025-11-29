/*
  Warnings:

  - You are about to drop the column `amount` on the `gajitransaksi` table. All the data in the column will be lost.
  - Added the required column `DinasLuarKota` to the `GajiTransaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gajiPokok` to the `GajiTransaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `potongan` to the `GajiTransaksi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalGaji` to the `GajiTransaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gajitransaksi` DROP COLUMN `amount`,
    ADD COLUMN `DinasLuarKota` DOUBLE NOT NULL,
    ADD COLUMN `gajiPokok` DOUBLE NOT NULL,
    ADD COLUMN `potongan` DOUBLE NOT NULL,
    ADD COLUMN `totalGaji` DOUBLE NOT NULL;
