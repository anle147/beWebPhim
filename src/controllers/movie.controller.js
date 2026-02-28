const { poolPromise } = require("../config/db");

exports.getAllMovies = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const { type } = req.query;

    let query = "SELECT * FROM Movies";
    const request = pool.request();

    // Nếu có truyền type thì filter theo Type trong DB
    if (type) {
      query += " WHERE Type = @type";
      request.input("type", type);
    }

    const result = await request.query(query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.getMovieById = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const { id } = req.params;

    const result = await pool.request()
      .input("id", id)
      .query("SELECT * FROM Movies WHERE MovieID = @id");

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    next(error);
  }
};
exports.searchMovies = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const { keyword } = req.query;

    const result = await pool.request()
      .input("keyword", `%${keyword}%`)
      .query(`
        SELECT * FROM Movies
        WHERE Title COLLATE SQL_Latin1_General_CP1_CI_AI LIKE @keyword
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    next(error);
  }
};