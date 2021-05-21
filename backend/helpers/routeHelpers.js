const Joi = require("joi");

const uuidRequired = () =>
  Joi.string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    .required();

const nonNegativeInteger = () => Joi.number().integer().min(0);

module.exports = {
  validateParam: (schema, name) => {
    return (req, res, next) => {
      //[name] is dynamically added property to an object
      const result = Joi.validate({ param: req.params[name] }, schema);

      if (result.error) return res.status(400).json({ message: result.error.details[0].message });
      if (!req.value) req.value = {};
      if (!req.value.params) req.value.params = {};
      req.value.params[name] = result.value.param;
      next();
    };
  },
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) return res.status(400).json({ message: result.error.details[0].message });

      if (!req.value) req.value = {};
      req.value["body"] = result.value;
      next();
    };
  },
  validateQueryString: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.query, schema);
      if (result.error) return res.status(400).json({ message: result.error.details[0].message });

      if (!req.value) req.value = {};
      req.value["query"] = result.value;
      next();
    };
  },

  schemas: {
    idSchema: Joi.object().keys({
      param: uuidRequired(), // TODO, this one is repeating alot, put it in common validators or similar
    }),
    mongoIdSchema: Joi.object().keys({
      param: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
    }),
    skipSchema: Joi.object().keys({
      skip: Joi.number().integer().min(0).required(),
    }),
    imageQueryIDpublicIDSchema: Joi.object().keys({
      imageQueryID: uuidRequired(),
      publicID: uuidRequired(),
      refreshID: nonNegativeInteger(),
    }),
    singleGalleryImageSchema: Joi.object().keys({
      imageQueryID: uuidRequired(),
      publicID: uuidRequired(),
      singleImageID: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      refreshID: nonNegativeInteger(),
    }),
  },
};
