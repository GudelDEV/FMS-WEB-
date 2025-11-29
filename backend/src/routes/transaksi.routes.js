import express from "express";
import prisma from "../config/db.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();
router.get("/me", async (req, res) => {
  try {
    const { staffId } = req.query;
    if (!staffId) return res.status(400).json({ message: "staffId hilang" });

    const transaksi = await prisma.transaksi.findMany({
      where: { staffId: Number(staffId) },
      include: {
        staff: {
          include: { divisi: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ transaksi });
  } catch (err) {
    console.error("GET ERROR:", err);
    return res.status(500).json({ message: "Gagal mengambil transaksi" });
  }
});

// POST /api/transaksi
router.post("/create", upload.array("bukti"), async (req, res) => {
  try {
    const { type, amount, description, staffId } = req.body;

    if (!type || !amount || !staffId)
      return res.status(400).json({ message: "Data tidak lengkap" });

    const buktiFiles = req.files?.map((f) => f.filename) || [];

    // console.log(req.body);

    const transaksi = await prisma.transaksi.create({
      data: {
        type,
        amount: Number(amount),
        description,
        status: "pending",
        staffId: Number(staffId),
        buktiTransaksi: buktiFiles, // ← sesuai model
      },
    });

    return res.json({ sukses: true, transaksi });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    return res.status(500).json({ message: "Gagal membuat transaksi" });
  }
});

/* ============================================================
    UPDATE TRANSAKSI (HANYA STATUS PENDING)
    PUT /api/transaksi/:id
==============================================================*/
router.put("/:id", upload.array("bukti"), async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description, oldBukti } = req.body;

    // console.log("BODY:", req.body);
    // console.log("FILES:", req.files);

    const buktiLama = oldBukti ? JSON.parse(oldBukti) : [];

    const existing = await prisma.transaksi.findUnique({
      where: { id: Number(id) },
    });

    if (!existing)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    // sesuaikan dengan model
    if (existing.status !== "pending") {
      return res.status(400).json({
        message: "Transaksi sudah di-approve/reject, tidak bisa diubah",
      });
    }

    const buktiBaru = req.files?.map((file) => file.filename) || [];

    const finalBukti = [...buktiLama, ...buktiBaru];

    const updated = await prisma.transaksi.update({
      where: { id: Number(id) },
      data: {
        type,
        amount: Number(amount),
        description,
        buktiTransaksi: finalBukti,
      },
    });

    return res.json({ sukses: true, transaksi: updated });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({ message: "Gagal update transaksi" });
  }
});

export default router;
