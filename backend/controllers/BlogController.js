const passport = require("passport");
const passportJWT = passport.authenticate("jwt", { session: false });

const router = require("express-promise-router")();
const BlogService = require("../services/BlogService");
const { BlogValidation, validateBody, validateParam, validateQueryString } = require("../core/validation");

router
  .route("/blog")

  .post(passportJWT, validateBody(BlogValidation.createBlogSchema), BlogService.create)
  .get(validateQueryString(BlogValidation.searchCriteriaSchema), BlogService.search);

router
  .route("/blog/:blogId")

  .get(passportJWT, validateParam(BlogValidation.idSchema, "blogId"), BlogService.getOne)
  .delete(passportJWT, validateParam(BlogValidation.idSchema, "blogId"), BlogService.deleteOne);

router
  .route("/blog/:blogId/like")

  .post(passportJWT, validateParam(BlogValidation.idSchema, "blogId"), validateBody(BlogValidation.likeSchema), BlogService.upsertLike);

module.exports = router;
