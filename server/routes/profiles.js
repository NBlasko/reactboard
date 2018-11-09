const passport = require('passport');
require('../passport');
const passportJWT = passport.authenticate('jwt', { session: false });

const router = require('express-promise-router')();
const ProfileController = require('../controllers/profiles');
const { validateBody, validateParam, validateQueryString, schemas } = require('../helpers/routeHelpers')

const  parser = require('../helpers/uploadHelpers')


// Always use data validation before mongodb, and I mean first thing after the request has been made. Don't rely only on mongoose schema to validate your responds, sometimes we will perform some
// calculations instead of saving the data to mongodb and then we will miss that request to validate because it never went through schema

router.route('/')
 .get(passportJWT, validateQueryString(schemas.skipAuthorsPublicIDSchema), ProfileController.getProfileMessages)  //no need to vaidate because there are no inputs in get all
// .post(passportJWT, validateBody(schemas.blogSchema), BlogController.newBlog);

router.route('/:publicID')
    .get(passportJWT, validateParam(schemas.idSchema, 'publicID'), ProfileController.getSingleProfile);


router.route('/:publicID/trust')
    // .get(passportJWT, BlogController.index)  //no need to vaidate because there are no inputs in get all
    .post(passportJWT, validateParam(schemas.idSchema, 'publicID'), validateBody(schemas.trustSchema), ProfileController.newProfileTrust);


router.route('/images')
    // .get(passportJWT, BlogController.index)  //no need to vaidate because there are no inputs in get all
    .post(passportJWT, parser.single("image"), ProfileController.newImage);



module.exports = router;