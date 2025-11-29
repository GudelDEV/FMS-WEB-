import express from "express";
import bcrypt from "bcryptjs";
const router = express.Router();
import prisma from "../config/db.js";

// =====================
// GET ALL USERS
// =====================
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { isActive: true }, // <--- FILTER PENTING
      include: {
        divisi: true,
      },
      orderBy: { id: "desc" },
    });

    const formattedUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      role: u.role,
      division: u.divisi?.name || null,
      divisiId: u.divisiId,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    res.json({ success: true, data: formattedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil users" });
  }
});

// =====================
// GET USER BY ID
// =====================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { divisi: true },
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        division: user.divisi?.name || null,
        divisiId: user.divisiId,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil user" });
  }
});

// =====================
// CREATE USER
// =====================

router.post("/", async (req, res) => {
  try {
    const { name, username, password, email, role, divisiId } = req.body;

    const fixedRole = role.trim().toLowerCase(); // FIX BREE 🔥

    // hash password dulu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword, // simpan password yang sudah di-hash
        email,
        role: fixedRole,
        divisiId: divisiId || null,
      },
      include: { divisi: true },
    });

    res.json({
      success: true,
      data: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        division: newUser.divisi?.name || null,
        divisiId: newUser.divisiId,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal menambahkan user" });
  }
});

// =====================
// UPDATE USER
// =====================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, password, email, role, divisiId } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        username,
        password: hashedPassword, // hash jika password diubah
        email,
        role,
        divisiId: divisiId || null,
      },
      include: { divisi: true },
    });

    res.json({
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        division: updatedUser.divisi?.name || null,
        divisiId: updatedUser.divisiId,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengupdate user" });
  }
});

// =====================
// DELETE USER
// =====================
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ success: true, message: "User berhasil di-nonaktifkan" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal menghapus user" });
  }
});

export default router;
