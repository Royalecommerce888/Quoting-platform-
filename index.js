const express = require("express");
const path = require("path");
require("dotenv").config();

const db = require("./db");
const { getMarkupChain, applyMarkups } = require("./markups");

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
    res.status(500).json({
      error: "DB error",
      message: err.message,
      code: err.code,
      detail: err.detail
    });
  }
});

// TODO: put your real C_ID from the database here:
const C_ID = "d39d29b5-861b-4b03-be8b-3da6ea6ed543";

app.get("/quote-demo", async (req, res) => {
  const baseRate = 100; // pretend carrier base cost is $100

  try {
    const chain = await getMarkupChain(C_ID);  // e.g. [0.10, 0.03]
    const final = applyMarkups(baseRate, chain);

    res.render("quote-demo", {
      baseRate,
      markups: chain,
      finalRate: final.toFixed(2)
    });
  } catch (err) {
    console.error("Quote demo error:", err);
    res.status(500).json({
      error: "Quote demo error",
      message: err.message,
      code: err.code,
      detail: err.detail
    });
  }
});

// Home page (simple placeholder)
app.get("/", (req, res) => {
  res.render("home", { title: "Shipping Platform" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
