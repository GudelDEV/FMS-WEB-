import express from "express";
const router = express.Router();
import prisma from "../config/db.js";

/**
 * ================================
 * 1. POST /gaji
 * Tambah transaksi gaji karyawan
 * ================================
 */
router.post("/gaji", async (req, res) => {
  try {
    const { karyawanId, staffId, gajiPokok, DinasLuarKota, potongan, month } =
      req.body;

    if (!karyawanId || !staffId || !gajiPokok || !month) {
      return res.status(400).json({
        success: false,
        message: "karyawanId, staffId, gajiPokok, dan month wajib diisi",
      });
    }

    const totalGaji =
      Number(gajiPokok) + Number(DinasLuarKota || 0) - Number(potongan || 0);

    const tambahGaji = await prisma.gajiTransaksi.create({
      data: {
        karyawanId: Number(karyawanId),
        staffId: Number(staffId),
        gajiPokok: Number(gajiPokok),
        DinasLuarKota: Number(DinasLuarKota || 0),
        potongan: Number(potongan || 0),
        totalGaji,
        month: new Date(month),
      },
      include: {
        karyawan: true,
        staff: true,
      },
    });

    res.json({ success: true, data: tambahGaji });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan transaksi gaji",
    });
  }
});

/**
 * ======================================================
 * 2. GET /:id/gaji
 * Ambil semua transaksi gaji berdasarkan id karyawan
 * ======================================================
 */
router.get("/:id/gaji", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const gaji = await prisma.gajiTransaksi.findMany({
      where: { karyawanId: id },
      orderBy: { month: "desc" },
    });

    res.json({ success: true, data: gaji });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil transaksi gaji",
    });
  }
});

/**
 * ============================
 * 3. GET /
 * Ambil semua data karyawan
 * ============================
 */
router.get("/", async (req, res) => {
  try {
    const karyawan = await prisma.karyawan.findMany({
      include: {
        divisi: true,
        gajiTransaksi: true,
      },
      orderBy: { id: "desc" },
    });

    res.json({ success: true, data: karyawan });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data karyawan" });
  }
});

/**
 * =======================================
 * 4. POST /
 * Tambah data karyawan baru
 * =======================================
 */
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, role, address, divisiId, salary } = req.body;
    console.log(req.body);

    if (
      !name ||
      !phone ||
      !email ||
      !role ||
      !divisiId ||
      !salary ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
    }

    const newKaryawan = await prisma.karyawan.create({
      data: {
        name,
        phone,
        email,
        posisi: role,
        addres: address,
        divisiId: Number(divisiId),
        gaji: Number(salary),
      },
      include: { divisi: true },
    });

    res.json({ success: true, data: newKaryawan });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Gagal menambahkan karyawan",
    });
  }
});

/**
 * ====================================
 * 5. PUT /:id
 * Edit data karyawan
 * ====================================
 */
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, phone, email, posisi, addres, divisiId, gaji } = req.body;

    // console.log(req.body);

    const updated = await prisma.karyawan.update({
      where: { id },
      data: {
        name: name,
        phone: phone,
        email: email,
        posisi: posisi,
        addres: addres,
        divisiId: Number(divisiId),
        gaji: Number(gaji),
      },
      include: { divisi: true },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengedit karyawan" });
  }
});

/**
 * ====================================
 * 6. DELETE /:id
 * Hapus karyawan
 * ====================================
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.karyawan.delete({ where: { id } });

    res.json({ success: true, message: "Karyawan berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message:
        "Gagal menghapus karyawan (cek apakah punya gajiTransaksi terkait)",
    });
  }
});

export default router;
