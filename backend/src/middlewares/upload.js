import multer from "multer";
import express from "express"; // <- import express
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const uploadFolder = path.join(__dirname, "../../../frontend/public/imageBook");
if (!existsSync(uploadFolder)) mkdirSync(uploadFolder, { recursive: true });

// Multer
export const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadFolder),
    filename: (_, file, cb) => cb(null, file.originalname),
  }),
});

// Middleware untuk serve static folder
export const serveImages = (app) => {
  app.use("/imageBook", express.static(uploadFolder)); // <- pakai import express
};
