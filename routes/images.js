const passport = require('passport');
require('../passport');
const passportJWT = passport.authenticate('jwt', { session: false });

const router = require('express-promise-router')();
const ImageController = require('../controllers/images');
const { validateBody, validateParam, validateQueryString, schemas } = require('../helpers/routeHelpers')

const parser = require('../helpers/uploadHelpers')


//this one is used for profile image on profile page and on searched profiles
router.route('/')
    .get(validateQueryString(schemas.imageQueryIDpublicIDSchema),ImageController.fetchProfileImage)


//ovo iznad ce na kraju biti modifikovano ili obrisano

router.route('/profileimage')
    .post(passportJWT, validateBody(schemas.mongoIdSchema), ImageController.setProfileImage);



router.route('/gallerylist')  //add list of images id's to redux
    .get(passportJWT, validateQueryString(schemas.skipAuthorsPublicIDSchema), ImageController.gallerylist);

router.route('/galleryImage')
    .get(validateQueryString(schemas.singleGalleryImageSchema), ImageController.singleGalleryImage)  //sends an image to <img /> tag in gallery
    .post(passportJWT, parser.single("image"), ImageController.newGalleryImage); //uploads image in gallery

router.route('/galleryImage/:id')  //deletes an image with the given id from gallery
    .delete(passportJWT, validateParam(schemas.mongoIdSchema, "id"), ImageController.deleteGalleryImage);
module.exports = router;