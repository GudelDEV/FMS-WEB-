import express from "express";
import cors from "cors";
import { serveImages } from "./src/middlewares/upload.js";
import { configDotenv } from "dotenv";

import loginRoutes from "./src/routes/login.routes.js";
import divisionRoutes from "./src/routes/divisions.routes.js";
import usersRoutes from "./src/routes/user.routes.js";
import karyawanRoutes from "./src/routes/karyawan.routes.js";
import gajiRoutes from "./src/routes/gajiKaryawan.routes.js";
import financeDataRoutes from "./src/routes/financeData.routes.js";
import reportsRoutes from "./src/routes/reports.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import transaksiRoutes from "./src/routes/transaksi.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
configDotenv();
// Serve static images
serveImages(app);

// Routes
app.use("/api/login", loginRoutes);
app.use("/api/division", divisionRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/karyawan", karyawanRoutes);
app.use("/api/gaji", gajiRoutes);
app.use("/api/finance", financeDataRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transaksi", transaksiRoutes);

export default app;
