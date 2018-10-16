const passport = require('passport');
require('../passport');
const passportJWT = passport.authenticate('jwt', { session: false });

const router = require('express-promise-router')();
const BlogController = require('../controllers/blogs');
const { validateBody,validateParam, schemas } = require('../helpers/routeHelpers')


// Always use data validation before mongodb, and I mean first thing after the request has been made. Don't rely only on mongoose schema to validate your responds, sometimes we will perform some
// calculations instead of saving the data to mongodb and then we will miss that request to validate because it never went through schema

router.route('/')
  .get(passportJWT, BlogController.index)  //no need to vaidate because there are no inputs in get all
  .post(passportJWT, validateBody(schemas.blogSchema), BlogController.newBlog);


router.route('/:blogId')
  .get(passportJWT, validateParam(schemas.idSchema, 'blogId'), BlogController.getSingleBlog);

  router.route('/:blogId/comments')
  .get(passportJWT,validateParam(schemas.idSchema, 'blogId'), BlogController.getBlogsComments)
  .post(passportJWT,validateParam(schemas.idSchema, 'blogId'), validateBody(schemas.commentSchema), BlogController.newBlogsComment);
module.exports = router;