const passport = require("passport");
const passportJWT = passport.authenticate("jwt", { session: false });
const router = require("express-promise-router")();
const UserProfileService = require("../services/UserProfileService");
const { validateBody, validateParam, validateQueryString, schemas } = require("../helpers/routeHelpers");

router
  .route("/getManyBlogs")
  .get(passportJWT, validateQueryString(schemas.skipAuthorsPublicIDSchema), UserProfileService.getManyBlogs);

router
  .route("/search")
  .get(passportJWT, validateQueryString(schemas.searchCriteriaSchema), UserProfileService.searchMany);

router
  .route("/loggedIn")
  .get(passportJWT, UserProfileService.getLoggedIn);

router
  .route("/userProfileId/:userProfileId")
  .get(passportJWT, validateParam(schemas.idSchema, "userProfileId"), UserProfileService.getOne);

router
  .route("/userProfileId/:userProfileId/trust")
  .post(passportJWT, validateParam(schemas.idSchema, "userProfileId"), validateBody(schemas.trustSchema), UserProfileService.upsertTrust);

module.exports = router;
