const express = require("express");
const cors = require("cors");
const movieRoutes = require("./routes/movies.route");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// routes
app.use("/api/movies", movieRoutes);

// middleware xử lý lỗi
app.use(errorHandler);

module.exports = app;
