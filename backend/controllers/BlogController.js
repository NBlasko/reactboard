const passport = require('passport');
//require('../core/auth/AuthStrategies');
const passportJWT = passport.authenticate('jwt', { session: false });

const router = require('express-promise-router')();
const BlogService = require('../services/BlogService');
const {
  validateBody,
  validateParam,
  validateQueryString,
  schemas } = require('../helpers/routeHelpers')

// Always use data validation before mongodb, 
// and I mean first thing after the request has been made.
// Don't rely only on mongoose schema to validate your responds,
// sometimes we will perform some calculations instead of saving the data
// to mongodb and then we will miss that request to validate 
// because it never went through schema

router.route('/')

  .get(
    passportJWT,
    validateQueryString(schemas.skipCriteriaSchema),
    BlogService.index
  )
  .post(
    passportJWT,
    validateBody(schemas.blogSchema),
    BlogService.newBlog
  );

router.route('/search')
  .get(
    passportJWT,
    validateQueryString(schemas.searchCriteriaSchema),
    BlogService.searchBlogs
  );

router.route('/:blogId')
  .get(
    passportJWT,
    validateParam(schemas.idSchema, 'blogId'),
    BlogService.getSingleBlog
  )
  .delete(
    passportJWT,
    validateParam(schemas.idSchema, 'blogId'),
    BlogService.deleteSingleBlog
  );

router.route('/:blogId/comments')
  .get(
    passportJWT,
    validateParam(schemas.idSchema, 'blogId'),
    validateQueryString(schemas.skipSchema),
    BlogService.getBlogsComments
  )
  .post(
    passportJWT,
    validateParam(schemas.idSchema, 'blogId'),
    validateBody(schemas.commentSchema),
    BlogService.newBlogsComment
  );


router.route('/:blogId/like')

//hit a like/dislike on a blog
  .post(
    passportJWT,
    validateParam(schemas.idSchema, 'blogId'),
    validateBody(schemas.likeSchema),
    BlogService.newBlogsLike
  );   

module.exports = router;