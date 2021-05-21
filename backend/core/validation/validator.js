const Joi = require("joi");

const emailRequired = () => Joi.string().email().required();
const passwordReqired = () => Joi.string().trim().min(10).required();
const displayNameRequired = () => Joi.string().required().min(4).max(30);

const uuidRequired = () =>
  Joi.string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    .required();

const hex24IdOptional = () =>
  Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .allow("", null)
    .required();

const nonNegativeInteger = () => Joi.number().integer().min(0);
const accessCode = () => Joi.string().length(5).required();
const vote = () => Joi.number().integer().min(-1).max(1).invalid(0).required();
const stringRequired = () => Joi.string().required();
const stringOptional = () => Joi.string().allow("", null);
const numberOptional = () => Joi.number().allow("", null);
const sortByRegex = () => Joi.string().regex(/^(createdAt|likeCount|viewCount)$/);

module.exports = {
  hex24IdOptional,
  numberOptional,
  stringOptional,
  emailRequired,
  passwordReqired,
  displayNameRequired,
  uuidRequired,
  nonNegativeInteger,
  accessCode,
  vote,
  stringRequired,
  sortByRegex,
};
