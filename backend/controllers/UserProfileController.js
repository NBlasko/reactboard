/* Passport */
const passport = require('passport');
//require('../core/auth/AuthStrategies');
const passportJWT = passport.authenticate('jwt', { session: false });

/* wrapper router that catches errors and  "next(error)" automatically */
const router = require('express-promise-router')();

/* controllers */
const UserProfileService = require('../services/UserProfileService');

/* helpers */
const {
    validateBody,
    validateParam,
    validateQueryString,
    schemas
} = require('../helpers/routeHelpers')


/*             **** NOTE TO MYSELF ****
Always use data validation before mongodb, and I mean first thing after
the request has been made. Don't rely only on mongoose schema to validate your responds,
sometimes we will perform some calculations instead of saving the data to mongodb
and then we will miss that request to validate because it never went through schema */

/* routes*/

router.route('/')
    /* fetch messages that were posted by profile which we are currently looking */
    .get(
        passportJWT,
        validateQueryString(schemas.skipAuthorsPublicIDSchema),
        UserProfileService.getProfileMessages
    )

router.route('/search')
    /* fetch profiles data that match criterias described in client-side input search-text */
    .get(
        passportJWT,
        validateQueryString(schemas.searchCriteriaSchema),
        UserProfileService.searchProfiles
    );

router.route('/:publicID')
    /* fetch profile data with the given id */
    .get(
        passportJWT,
        validateParam(schemas.idSchema, 'publicID'),
        UserProfileService.getSingleProfile);

router.route('/:publicID/trust')
    /* add a trust vote to a profile with the given id */
    .post(passportJWT,
        validateParam(schemas.idSchema, 'publicID'),
        validateBody(schemas.trustSchema),
        UserProfileService.newProfileTrust);


module.exports = router;