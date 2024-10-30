// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Load variables from .env file
require("dotenv").config({ path: ".env.local" });

const JWT_SECRET = process.env.JWT_SECRET || "CHANGETHISPLEASE";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Token biasanya dikirimkan dengan format "Bearer <token>"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    // Verifikasi JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Simpan data user dari token ke req.user
    next(); // Lanjutkan ke route berikutnya
  } catch (error) {
    return res.status(403).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
