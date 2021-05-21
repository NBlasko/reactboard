const passport = require("passport");
const passportJWT = passport.authenticate("jwt", { session: false });

const router = require("express-promise-router")();
const BlogCommentService = require("../services/BlogCommentService");
const { BlogCommentValidation, validateBody, validateParam, validateQueryString } = require("../core/validation");
router
  .route("/blog/:blogId/comment")

  .get(
    passportJWT,
    validateParam(BlogCommentValidation.idSchema, "blogId"),
    validateQueryString(BlogCommentValidation.skipSchema),
    BlogCommentService.getMany
  )
  .post(
    passportJWT,
    validateParam(BlogCommentValidation.idSchema, "blogId"),
    validateBody(BlogCommentValidation.blogCommentSchema),
    BlogCommentService.create
  );

module.exports = router;
