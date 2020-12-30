const Joi = require("joi");

const uuidRequired = () =>
  Joi.string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    .required();

const nonNegativeInteger = () =>
  Joi.number()
    .integer()
    .min(0);

const vote = () =>
  Joi.number()
    .integer()
    .min(0)
    .max(1)
    .required();

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
  validateBody: schema => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) return res.status(400).json({ message: result.error.details[0].message });

      if (!req.value) req.value = {};
      req.value["body"] = result.value;
      next();
    };
  },
  validateQueryString: schema => {
    return (req, res, next) => {
      const result = Joi.validate(req.query, schema);
      if (result.error) return res.status(400).json({ message: result.error.details[0].message });

      if (!req.value) req.value = {};
      req.value["query"] = result.value;
      next();
    };
  },

  schemas: {
    blogSchema: Joi.object().keys({
      title: Joi.string().required(),
      body: Joi.string().required(),
      imageId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .allow("", null)
        .required()
    }),
    idSchema: Joi.object().keys({
      param: uuidRequired() // param, becuse I named it like that above, in validateParam method
    }),
    mongoIdSchema: Joi.object().keys({
      param: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
    }),
    commentSchema: Joi.object().keys({
      author: Joi.string().required(),
      authorsPublicID: uuidRequired(),
      body: Joi.string().required()
    }),
    trustSchema: Joi.object().keys({
      trust: vote()
    }),
    likeSchema: Joi.object().keys({
      like: vote()
    }),
    skipCriteriaSchema: Joi.object().keys({
      skip: Joi.number()
        .integer()
        .min(0)
        .required(),
      searchText: Joi.string(),
      criteria: Joi.string()
        .regex(/^(new|mostlikedblogs|mostseenblogs|profile)$/)
        .required()
    }),
    skipAuthorsPublicIDSchema: Joi.object().keys({
      skip: Joi.number()
        .integer()
        .min(0)
        .required(),
      authorsPublicID: uuidRequired()
    }),
    skipSchema: Joi.object().keys({
      skip: Joi.number()
        .integer()
        .min(0)
        .required()
    }),
    searchCriteriaSchema: Joi.object().keys({
      searchText: Joi.string().required()
    }),
    imageQueryIDpublicIDSchema: Joi.object().keys({
      imageQueryID: uuidRequired(),
      publicID: uuidRequired(),
      refreshID: nonNegativeInteger()
    }),
    singleGalleryImageSchema: Joi.object().keys({
      imageQueryID: uuidRequired(),
      publicID: uuidRequired(),
      singleImageID: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      refreshID: nonNegativeInteger()
    })
  }
};
