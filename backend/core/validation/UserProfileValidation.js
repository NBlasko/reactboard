const Joi = require("joi");
const validator = require("./validator");
module.exports = {
  idSchema: Joi.object().keys({
    param: validator.uuidRequired(),
  }),
  searchCriteriaSchema: Joi.object().keys({
    searchText: validator.stringOptional(),
    sortBy: validator.sortByRegex(),
    skip: validator.numberOptional(),
  }),
  trustSchema: Joi.object().keys({
    trust: validator.vote(),
  }),
};
