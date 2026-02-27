const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller");

router.get("/", movieController.getAllMovies);
router.get("/search", movieController.searchMovies); // 👈 bỏ chữ movies
router.get("/:id", movieController.getMovieById);


module.exports = router;
