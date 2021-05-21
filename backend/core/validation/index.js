const Joi = require("joi");

module.exports = {
  validateParam: (schema, name) => {
    return (req, res, next) => {
      const result = Joi.validate({ param: req.params[name] }, schema);
      if (result.error) return res.handleError(400, result.error.details[0].message);
      if (!req.value) req.value = {};
      if (!req.value.params) req.value.params = {};
      req.value.params[name] = result.value.param;
      next();
    };
  },

  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) return res.handleError(400, result.error.details[0].message);
      if (!req.value) req.value = {};
      req.value["body"] = result.value;
      next();
    };
  },

  validateQueryString: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.query, schema);
      if (result.error) return res.handleError(400, result.error.details[0].message);
      if (!req.value) req.value = {};
      req.value["query"] = result.value;
      next();
    };
  },
  AuthValidation: require("./AuthValidation"),
  BlogValidation: require("./BlogValidation"),
  BlogCommentValidation: require("./BlogCommentValidation"),
  UserProfileValidation: require("./UserProfileValidation"),
};
