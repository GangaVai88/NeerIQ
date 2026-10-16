const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { registerUser } = require("./Auth/registration");
const { loginUser } = require("./Auth/Login");
const { verifyToken } = require("./middleware/authMiddleware");
const { getProfile } = require("./Dashboard/profile");

dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors()); // Allow access from anywhere (update origin in production)
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// ── Auth Routes ───────────────────────────────────────────────────────────────
app.post("/api/auth/register", registerUser);
app.post("/api/auth/login", loginUser);

// ── Dashboard Routes (Protected) ──────────────────────────────────────────────
app.get("/api/dashboard/profile", verifyToken, getProfile);

// ── Central Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ── Database + Server ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

