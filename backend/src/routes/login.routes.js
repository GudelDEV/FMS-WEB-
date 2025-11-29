import express from "express";
import prisma from "../config/db.js"; // pastikan path sesuai
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authMiddleware } from "../middlewares/authMiddleware.js";

dotenv.config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// =====================
// Route: POST /login
// =====================

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    console.log("USER ROLE", user.role);

    if (!user)
      return res.status(401).json({ message: "username tidak ditemukan" });

    // ❌ Tambahkan pengecekan status nonaktif
    if (!user.isActive)
      return res.status(403).json({ message: "Akun Anda nonaktif" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Hanya superadmin bisa akses route ini
router.get("/admin-dashboard", authMiddleware(["superadmin"]), (req, res) => {
  res.json({ message: `Halo SuperAdmin ${req.user.userId}` });
});
router.get(
  "/staff/input-transaksi",
  authMiddleware(["staff", "superadmin"]),
  (req, res) => {
    res.json({ message: `Halo SuperAdmin ${req.user.userId}` });
  }
);

// Staff atau superadmin bisa akses
router.get(
  "/staff-info",
  authMiddleware(["staff", "superadmin"]),
  async (req, res) => {
    // console.log(req.body);
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: { divisi: true },
      });
      res.json({ user });
    } catch (err) {
      res.status(500).json({ message: "Gagal mengambil info staff" });
    }
  }
);

export default router;
