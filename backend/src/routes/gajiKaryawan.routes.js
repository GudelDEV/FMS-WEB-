import express from "express";
const router = express.Router();
import prisma from "../config/db.js";
import { upload } from "../middlewares/upload.js";

router.post("/create", async (req, res) => {
  try {
    const {
      karyawanId,
      staffId,
      gajiPokok,
      DinasLuarKota,
      potongan,
      month,
      totalGaji,
    } = req.body;

    // console.log(req.body);

    const gaji = await prisma.gajiTransaksi.create({
      data: {
        karyawanId: karyawanId,
        staffId: staffId,
        gajiPokok: gajiPokok,
        DinasLuarKota: DinasLuarKota,
        potongan: potongan,
        totalGaji: totalGaji,
        month: new Date(month),
      },
    });

    res.json({ success: true, data: gaji });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ambil gaji yang harus dibayar staff tertentu
router.get("/by-staff/:staffId", async (req, res) => {
  try {
    const staffId = Number(req.params.staffId);

    if (!staffId)
      return res.status(400).json({ message: "staffId tidak valid" });

    const gaji = await prisma.gajiTransaksi.findMany({
      where: { staffId },
      include: {
        karyawan: {
          include: { divisi: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ sukses: true, gaji });
  } catch (err) {
    console.error("GET GAJI ERROR:", err);
    res.status(500).json({ message: "Gagal mengambil data gaji" });
  }
});

router.put("/bayar/:id", upload.single("buktiPembayaran"), async (req, res) => {
  try {
    const gajiId = parseInt(req.params.id);
    const buktiFile = req.file ? req.file.filename : null;

    const updated = await prisma.gajiTransaksi.update({
      where: { id: gajiId },
      data: {
        status: "paid",
        buktiPembayaran: buktiFile,
        tanggalDibayar: new Date(),
      },
    });

    res.json({ sukses: true, gaji: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ sukses: false, message: "Gagal membayar gaji" });
  }
});

// Ambil semua gaji berdasarkan ID karyawan
router.get("/:karyawanId", async (req, res) => {
  try {
    const { karyawanId } = req.params;

    const gajiList = await prisma.gajiTransaksi.findMany({
      where: {
        karyawanId: Number(karyawanId),
      },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
          },
        },
        karyawan: true,
      },
      orderBy: {
        month: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: gajiList,
    });
  } catch (error) {
    console.error("Error mengambil data gaji:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data gajih karyawan",
    });
  }
});

export default router;
