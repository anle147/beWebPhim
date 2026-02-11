const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise; // lấy pool đã connect
    const result = await pool
      .request()
      .query("SELECT * FROM Movies");

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
