import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // WAJIB ADA

export const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log("HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "Token dibutuhkan" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      // console.log("DECODED:", decoded);

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Tidak punya akses" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Token invalid" });
    }
  };
};
