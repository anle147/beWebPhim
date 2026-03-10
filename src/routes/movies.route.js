const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller");

router.get("/", movieController.getAllMovies);
router.get("/search", movieController.searchMovies);

// router yêu thích
router.post("/favorite", movieController.addFavorite);
router.delete("/favorite", movieController.removeFavorite);
router.get("/favorite/:userId", movieController.getFavoriteMovies);

// phải đặt cuối cùng
router.get("/:id", movieController.getMovieById);

module.exports = router;