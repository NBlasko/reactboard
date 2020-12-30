const Joi = require("joi");

const emailRequired = () =>
  Joi.string()
    .email()
    .required();

const passwordReqired = () =>
  Joi.string().trim().min(10).required();

const displayNameRequired = () =>
  Joi.string()
    .required()
    .min(4)
    .max(30);

const uuidRequired = () =>
  Joi.string()
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    .required();

const nonNegativeInteger = () =>
  Joi.number()
    .integer()
    .min(0);

const accessCode = () =>
  Joi.string()
    .length(5)
    .required();

const vote = () =>
  Joi.number()
    .integer()
    .min(0)
    .max(1)
    .required();

module.exports = {
  emailRequired,
  passwordReqired,
  displayNameRequired,
  uuidRequired,
  nonNegativeInteger,
  accessCode,
  vote
};
