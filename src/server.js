require("dotenv").config();
const express = require("express");
const cors = require("cors");           // 👈 THÊM
const { poolPromise } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// 👇 BẮT BUỘC PHẢI ĐẶT TRƯỚC ROUTES
app.use(cors({
  origin: "http://localhost:5173" // React Vite
}));

app.use(express.json());

// test route
app.get("/api/movies", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Movies");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, async () => {
  await poolPromise;
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
