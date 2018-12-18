const passport = require('passport');
require('../passport');
const passportJWT = passport.authenticate('jwt', { session: false });

const router = require('express-promise-router')();
const ImageController = require('../controllers/images');
//const { validateBody, validateParam, validateQueryString, schemas } = require('../helpers/routeHelpers')

const  parser = require('../helpers/uploadHelpers')



router.route('/')
    .get(ImageController.singleImage)  //no need to vaidate because there are no inputs in get all
    //.post(passportJWT, parser.single("image"), ImageController.newImage);
    .post(passportJWT, parser.single("image"), ImageController.newImage);

router.route('/blog')
    .get(ImageController.singleImage)  //no need to vaidate because there are no inputs in get all
    //.post(passportJWT, parser.single("image"), ImageController.newImage);
    .post(passportJWT, parser.single("image"), ImageController.newImage);

router.route('/gallery')
    .get(ImageController.singleImage)  //no need to vaidate because there are no inputs in get all
    //.post(passportJWT, parser.single("image"), ImageController.newImage);
    .post(passportJWT, parser.single("image"), ImageController.newGalleryImage);
    
router.route('/gallery:id') 
    .delete(passportJWT, ImageController.deleteGalleryImage);
module.exports = router;