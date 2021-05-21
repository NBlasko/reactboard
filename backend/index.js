const path = require("path");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: path.resolve(process.cwd(), ".env"),
  });
}

const express = require("express");
const { errorHandler } = require("./helpers/ErrorHandler");
//const cors = require('cors');
const morgan = require("morgan");
require("./core/init/DbConnection").initDbConnection();
require("./core/init/StorageSetup").initStorageSetup();

const app = express();

app.use(morgan("dev"));
//app.use(cors({
//  origin: 'https://localhost:3000'
//}));

app.use(express.json());
app.use(errorHandler);

require("./core/init/AuthStrategies").initAuthStrategies();
const API_PREFIX = "/api";
app.use(
  API_PREFIX,
  require("./controllers/AuthController"),
  require("./controllers/BlogController"),
  require("./controllers/BlogCommentsController"),
  require("./controllers/UserProfileController")
);

app.use("/api/image", require("./controllers/ImageController")); // todo api/image

// Catch 404 errors
// In production replace this one with serving the frontend
app.use((req, res, next) => {
  const error = new Error();
  error.status = 404;
  error.message = "Not found";
  next(error);
});

// Catch all errors
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};

  const status = err.status || 500;
  res.status(status).json({
    message: error.message,
  });

  console.error("Error in handler function", err);
});

//start the server
const port = app.get("port") || 3001;

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");

  process.exit(1);
});

app.listen(port, () => {
  console.log(`listening on ${port}...`);
});
