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

exports.addFavorite = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const { userId, movieId } = req.body;

    const result = await pool.request()
      .input("userId", userId)
      .input("movieId", movieId)
      .query(`
        INSERT INTO FavoriteMovies (UserID, MovieID)
        VALUES (@userId, @movieId)
      `);

    res.status(201).json({
      message: "Đã thêm vào danh sách yêu thích"
    });

  } catch (error) {
    next(error);
  }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const { userId, movieId } = req.body;

    await pool.request()
      .input("userId", userId)
      .input("movieId", movieId)
      .query(`
        DELETE FROM FavoriteMovies
        WHERE UserID = @userId AND MovieID = @movieId
      `);

    res.status(200).json({
      message: "Đã xoá khỏi danh sách yêu thích"
    });

  } catch (error) {
    next(error);
  }
};

exports.getFavoriteMovies = async (req, res, next) => {
  try {
    const pool = await poolPromise;
    const { userId } = req.params;

    const result = await pool.request()
      .input("userId", userId)
      .query(`
        SELECT M.*
        FROM FavoriteMovies F
        JOIN Movies M ON F.MovieID = M.MovieID
        WHERE F.UserID = @userId
      `);

    res.status(200).json(result.recordset);

  } catch (error) {
    next(error);
  }
};