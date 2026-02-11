const { poolPromise } = require("../config/db");

exports.getAllMovies = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Movies");

    res.status(200).json(result.recordset);
  } catch (error) {
    next(error); // chuyển lỗi sang middleware
  }
};
