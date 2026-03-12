const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller");

// movies
router.get("/", movieController.getAllMovies);
router.get("/search", movieController.searchMovies);

// favorite
router.post("/favorite", movieController.addFavorite);
router.delete("/favorite", movieController.removeFavorite);
router.get("/favorite/:userId", movieController.getFavoriteMovies);

// actor
router.get("/actor/:actorId", movieController.getMoviesByActor);

// genres
router.get("/genres", movieController.getAllGenres);
router.get("/genres/:genreId/movies", movieController.getMoviesByGenre);

// comments
router.get("/:id/comments", movieController.getMovieComments);
router.post("/:id/comments", movieController.addComment);

// actors của phim
router.get("/:id/actors", movieController.getMovieActors);

// thể loại của phim
router.get("/:id/genres", movieController.getMovieGenres);

// PHẢI ĐỂ CUỐI
router.get("/:id", movieController.getMovieById);

module.exports = router;