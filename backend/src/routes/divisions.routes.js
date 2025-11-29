import express from "express";
import prisma from "../config/db.js"; // prisma client
import { log } from "console";
import { capitalizeWords } from "../uitils/capitalize.js";
const router = express.Router();

// =====================
// GET all divisions No include
// =====================
router.get("/select", async (_, res) => {
  try {
    const data = await prisma.divisi.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.json({
      succes: true,
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal Mengambil divisi" });
  }
});

// =====================
// GET all divisions
// =====================
router.get("/", async (req, res) => {
  try {
    const divisions = await prisma.divisi.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        users: {
          where: { isActive: true },
          include: {
            transaksi: true, // semua transaksi tiap user
          },
        },
        karyawans: true, // opsional untuk jumlah karyawan
      },
    });

    const data = divisions.map((d) => {
      // Total pengeluaran
      const totalExpenses = d.users.reduce((sum, u) => {
        const userExpenses = u.transaksi
          .filter((t) => t.type === "pengeluaran")
          .reduce((s, t) => s + t.amount, 0);
        return sum + userExpenses;
      }, 0);

      // Total pemasukan
      const totalIncome = d.users.reduce((sum, u) => {
        const userIncome = u.transaksi
          .filter((t) => t.type === "pemasukan")
          .reduce((s, t) => s + t.amount, 0);
        return sum + userIncome;
      }, 0);

      const totalEmployees = d.users.length; // bisa juga pakai d.karyawans.length

      return {
        ...d,
        totalExpenses,
        totalIncome,
        totalEmployees,
      };
    });

    // console.log(data);
    res.json({ succes: true, data: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data divisi" });
  }
});

// =====================
// GET division by ID
// =====================
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const division = await prisma.divisi.findUnique({
      where: { id: parseInt(id) },
      include: {
        staff: true,
        Transaksi: true,
      },
    });

    if (!division)
      return res.status(404).json({ message: "Divisi tidak ditemukan" });

    const totalExpenses = division.Transaksi.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const totalEmployees = division.staff.length;

    res.json({ ...division, totalExpenses, totalEmployees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data divisi" });
  }
});

// =====================
// CREATE new division
// =====================

router.post("/", async (req, res) => {
  let { name, description } = req.body;

  // Ubah nama divisi jadi kapital tiap kata
  name = capitalizeWords(name);

  try {
    const newDivision = await prisma.divisi.create({
      data: { name, description },
    });
    res.status(201).json(newDivision);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membuat divisi" });
  }
});

// =====================
// UPDATE division
// =====================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedDivision = await prisma.divisi.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });
    res.json(updatedDivision);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal update divisi" });
  }
});

// =====================
// DELETE division
// =====================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.divisi.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Divisi berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal hapus divisi" });
  }
});

export default router;
