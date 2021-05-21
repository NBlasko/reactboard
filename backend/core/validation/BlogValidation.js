const Joi = require("joi");
const validator = require("./validator");
module.exports = {
  createBlogSchema: Joi.object().keys({
    title: validator.stringRequired(),
    description: validator.stringRequired(),
    body: validator.stringRequired(),
    imageId: validator.hex24IdOptional(),
  }),
  searchCriteriaSchema: Joi.object().keys({
    searchText: validator.stringOptional(),
    sortBy: validator.sortByRegex(),
    skip: validator.numberOptional(),
  }),
  idSchema: Joi.object().keys({
    param: validator.uuidRequired(),
  }),
  likeSchema: Joi.object().keys({
    like: validator.vote(),
  }),
};
