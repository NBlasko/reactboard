const ERROR_OBJECT = {
  statusCode: 500,
  message: "Internal Error"
};

const errorHandler = (req, res, next) => {
  /**
   * @param statusCode {Number}
   * @param message {String}
   */
  res.handleError = (statusCode, message) =>
    res.status(statusCode).json({
      status: statusCode,
      message
    });

  next();
};

module.exports = { errorHandler };
