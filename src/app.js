const express = require("express");
const cors = require("cors");
const movieRoutes = require("./routes/movies.route");
const errorHandler = require("./middleware/error.middleware");
const authRoutes = require("./routes/auth.routes");



const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());



// routes
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);

// middleware xử lý lỗi
app.use(errorHandler);

module.exports = app;
