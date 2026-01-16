const express = require("express");
const path = require("path");
require("dotenv").config();

const db = require("./db");

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// DB test route
app.get("/db-test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ now: result.rows[0].now });
  } catch (err) {
    console.error("DB test error:", err);
    res.status(500).json({ error: "DB error", details: err.message });
  }
});

// Home page
app.get("/", (req, res) => {
  res.render("home", { title: "Shipping Platform" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
