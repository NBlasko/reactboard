
/* Passport */
const passport = require('passport');
//require('../core/auth/AuthStrategies');
const passportJWT = passport.authenticate('jwt', { session: false });

/* wrapper router that catches errors and  "next(error)" automatically */
const router = require('express-promise-router')();

/* controllers */
const Imageservice = require('../services/ImageService');

/* helpers */
const {
    validateBody,
    validateParam,
    validateQueryString,
    schemas
} = require('../helpers/routeHelpers')
const parser = require('../helpers/uploadHelpers')


/* routes*/

router.route('/')
    /*  fetch profile image on profile page and on searched profiles  */
    .get(
        validateQueryString(schemas.imageQueryIDpublicIDSchema),
        Imageservice.fetchProfileImage
    );


router.route('/profileimage')
    /*  find image URL in ImagesGallery model and saves it in User model as profile image */
    .post(
        passportJWT,
        validateBody(schemas.mongoIdSchema),
        Imageservice.setProfileImage
    );


router.route('/gallerylist')
    /*  fetches id's of images in ImagesGallery model  */
    .get(
        passportJWT,
        validateQueryString(schemas.skipSchema),
        Imageservice.gallerylist
    );


router.route('/galleryImage')
    /*  grab URL in gallery, then sends an image to <img /> tag in gallery  */
    .get(
        validateQueryString(schemas.singleGalleryImageSchema),
        Imageservice.singleGalleryImage
    )

    /* uploads image in gallery  */
    .post(
        passportJWT,
        parser.single("image"),
        Imageservice.newGalleryImage
    );


router.route('/galleryImage/:id')
    /*  deletes an image with the given id from gallery  */
    .delete(
        passportJWT,
        validateParam(schemas.mongoIdSchema, "id"),
        Imageservice.deleteGalleryImage
    );

module.exports = router;