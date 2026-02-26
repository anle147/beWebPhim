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

    res.status(200).json(result.recordset);
  } catch (error) {
    next(error);
  }
};