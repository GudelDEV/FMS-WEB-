import crypto from "crypto";
import fs from "fs";

// Generate random secret 64 bytes
const secret = crypto.randomBytes(64).toString("hex");
console.log("Generated JWT_SECRET:", secret);

// Cek apakah .env ada
const envPath = ".env";
let envContent = "";
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, "utf-8");
}

// Hanya tambahkan JWT_SECRET jika masih kosong
if (
  !envContent.includes("JWT_SECRET=") ||
  envContent.match(/JWT_SECRET=\s*$/)
) {
  fs.appendFileSync(envPath, `JWT_SECRET=${secret}\n`);
  console.log(".env updated dengan JWT_SECRET baru");
} else {
  console.log(".env sudah memiliki JWT_SECRET, tidak diubah");
}
