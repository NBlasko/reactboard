if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const express = require("express");
const { errorHandler } = require("./core/error");
//const cors = require('cors');
const morgan = require("morgan");
require("./core/init/DbConnection").initDbConnection();

const app = express();

app.use(morgan("dev"));
//app.use(cors({
//  origin: 'https://localhost:3000'
//}));

app.use(express.json());
app.use(errorHandler);

require("./core/init/AuthStrategies").initAuthStrategies();

app.use("/api/auth", require("./controllers/AuthController"));
app.use("/api/blogs", require("./controllers/BlogController")); //todo /api/blog
app.use("/api/profiles", require("./controllers/UserProfileController")); //todo /api/profile
app.use("/api/images", require("./controllers/ImageController")); // todo api/image

// Catch 404 errors
// In production replace this one with serving the front end
app.use((req, res, next) => {
  const error = new Error();
  error.status = 404;
  error.message = 'Not found';
  next(error);
});

// Catch all errors
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};

  const status = err.status || 500;
  res.status(status).json({
    message: error.message
  });

  console.error("Error in handler function", err);
});

//start the server
const port = app.get("port") || 3001;

process.on("uncaughtException", err => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");

  process.exit(1);
});

app.listen(port, () => {
  console.log(`listening on ${port}...`);
});
