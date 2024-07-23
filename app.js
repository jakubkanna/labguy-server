require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cors = require("cors");
var { errorHandler } = require("./middleware/errorHandler.js");

// Initialize Express app
var app = express();

// Set up rate limiter: maximum of twenty requests per minute
var RateLimit = require("express-rate-limit");
var limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50,
});

// Apply rate limiter to all requests
app.use(limiter);

//helmet

// Allows frontend application to make HTTP requests to Express application
app.use(cors());

// Connect to MongoDB
mongoose.set("strictQuery", false);
var mongoDB = process.env.DB_STRING;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

// Cloudinary config
require("./config/cloudinary.js");

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes setup
app.use("/api", require("./routes/index"));
app.use("/api/posts", require("./routes/posts.js"));
app.use("/api/projects", require("./routes/projects.js"));
app.use("/api/works", require("./routes/works.js"));
app.use("/api/tags", require("./routes/tags.js"));
app.use("/api/images", require("./routes/images.js"));
app.use("/api/videos", require("./routes/videos.js"));
app.use("/api/cld", require("./routes/cld.js"));
app.use("/api/settings", require("./routes/settings.js"));
app.use("/api/media", require("./routes/media.js"));

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(errorHandler);

module.exports = app;
