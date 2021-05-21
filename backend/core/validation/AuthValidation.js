const Joi = require("joi");
const validator = require("./validator");
module.exports = {
  signUp: Joi.object().keys({
    email: validator.emailRequired(),
    password: validator.passwordReqired(),
    displayName: validator.displayNameRequired()
  }),
  verifyMail: Joi.object().keys({
    email: validator.emailRequired(),
    accessCode: validator.accessCode()
  }),
  resendVerificationMail: Joi.object().keys({
    email: validator.emailRequired()
  }),
  signIn: Joi.object().keys({
    email: validator.emailRequired(),
    password: validator.passwordReqired()
  })
};
