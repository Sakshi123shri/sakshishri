// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();

// ---------------- PostgreSQL connection ----------------
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render free PostgreSQL
  },
});

// ---------------- Middleware ----------------
app.use(cors());
app.use(express.json());

// ---------------- Serve static frontend files ----------------
app.use(express.static(path.join(__dirname, "public")));

// ---------------- Contact form API ----------------
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *",
      [name, email, message]
    );

    res.json({ success: true, message: "Message sent", data: result.rows[0] });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------- Admin route to view all messages ----------------
app.get("/api/messages", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ---------------- Serve index.html for all other routes ----------------
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------------- Start server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));