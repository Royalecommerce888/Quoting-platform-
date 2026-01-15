const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.render("home", { title: "Shipping Platform" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});