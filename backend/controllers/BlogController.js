const passport = require("passport");
const passportJWT = passport.authenticate("jwt", { session: false });

const router = require("express-promise-router")();
const BlogService = require("../services/BlogService");
const { validateBody, validateParam, validateQueryString, schemas } = require("../helpers/routeHelpers");

router
  .route("/create")

  .post(passportJWT, validateBody(schemas.blogSchema), BlogService.create);

router.route("/search").get(passportJWT, validateQueryString(schemas.searchCriteriaSchema), BlogService.search);

router
  .route("/blogId/:blogId")
  .get(passportJWT, validateParam(schemas.idSchema, "blogId"), BlogService.getOne)
  .delete(passportJWT, validateParam(schemas.idSchema, "blogId"), BlogService.deleteOne);

router
  .route("/blogId/:blogId/comments") // TODO put in BlogComment controller and services
  .get(passportJWT, validateParam(schemas.idSchema, "blogId"), validateQueryString(schemas.skipSchema), BlogService.getBlogsComments)
  .post(passportJWT, validateParam(schemas.idSchema, "blogId"), validateBody(schemas.commentSchema), BlogService.newBlogsComment);

router
  .route("/blogId/:blogId/like") // TODO put in BlogLike Controller and services

  //hit a like/dislike on a blog
  .post(passportJWT, validateParam(schemas.idSchema, "blogId"), validateBody(schemas.likeSchema), BlogService.newBlogsLike);

module.exports = router;
