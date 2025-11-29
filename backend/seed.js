import prisma from "./src/config/db.js";
import bcrypt from "bcryptjs";

async function main() {
  const defaultEmail = "admin@example.com";
  const defaultPassword = "kazeali07";
  const defaultUsername = "admin";
  const defaultDivisi = "Manager";
  

  // 1. Cek apakah divisi default sudah ada
  let divisi = await prisma.divisi.findFirst({
    where: { name: defaultDivisi },
  });

  // 2. Jika divisi belum ada → buat divisi baru
  if (!divisi) {
    divisi = await prisma.divisi.create({
      data: {
        name: defaultDivisi,
        description: "Divisi default sistem",
      },
    });
    console.log(`Divisi '${defaultDivisi}' berhasil dibuat.`);
  }

  // 3. Cek apakah admin default sudah ada
  const existingAdmin = await prisma.user.findUnique({
    where: { email: defaultEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await prisma.user.create({
      data: {
        name: "Super Admin",
        username: defaultUsername,
        email: defaultEmail,
        password: hashedPassword,
        role: "superadmin", // enum Role
        divisiId: divisi.id, // ← masukin divisi default
      },
    });

    console.log("Admin default berhasil dibuat.");
  } else {
    console.log("Admin default sudah ada.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
