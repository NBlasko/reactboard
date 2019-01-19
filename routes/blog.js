const passport = require('passport');
require('../passport');
const passportJWT = passport.authenticate('jwt', { session: false });

const router = require('express-promise-router')();
const BlogController = require('../controllers/blogs');
const { validateBody, validateParam, validateQueryString, schemas } = require('../helpers/routeHelpers')


// Always use data validation before mongodb, and I mean first thing after the request has been made. Don't rely only on mongoose schema to validate your responds, sometimes we will perform some
// calculations instead of saving the data to mongodb and then we will miss that request to validate because it never went through schema

router.route('/')
  .get(passportJWT, validateQueryString(schemas.skipCriteriaSchema), BlogController.index)  //no need to vaidate because there are no inputs in get all
  .post(passportJWT, validateBody(schemas.blogSchema), BlogController.newBlog);



router.route('/search')
  .get(passportJWT, validateQueryString(schemas.searchCriteriaSchema), BlogController.searchBlogs);


router.route('/:blogId')
  .get(passportJWT, validateParam(schemas.idSchema, 'blogId'), BlogController.getSingleBlog)
  .delete(passportJWT, validateParam(schemas.idSchema, 'blogId'), BlogController.deleteSingleBlog);

  router.route('/:blogId/comments')
  .get(passportJWT, validateParam(schemas.idSchema, 'blogId'), BlogController.getBlogsComments)
  .post(passportJWT, validateParam(schemas.idSchema, 'blogId'), validateBody(schemas.commentSchema), BlogController.newBlogsComment);


router.route('/:blogId/like')
  // .get(passportJWT, BlogController.index)  //no need to vaidate because there are no inputs in get all
  .post(passportJWT, validateParam(schemas.idSchema, 'blogId'), validateBody(schemas.likeSchema), BlogController.newBlogsLike);   //hit a like/dislike on a blog



module.exports = router;