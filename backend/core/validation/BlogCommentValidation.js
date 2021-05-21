const Joi = require("joi");
const validator = require("./validator");
module.exports = {
  skipSchema: Joi.object().keys({
    skip: validator.numberOptional(),
  }),
  blogCommentSchema: Joi.object().keys({
    body: validator.stringRequired(),
  }),
  idSchema: Joi.object().keys({
    param: validator.uuidRequired(),
  }),
};
