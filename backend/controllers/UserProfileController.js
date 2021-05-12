const passport = require("passport");
const passportJWT = passport.authenticate("jwt", { session: false });
const router = require("express-promise-router")();
const UserProfileService = require("../services/UserProfileService");
const { validateBody, validateParam, validateQueryString, schemas } = require("../helpers/routeHelpers");

router
  .route("/getManyBlogs")   //TODO,  put it in BlogService
  .get(passportJWT, validateQueryString(schemas.skipAuthorsPublicIDSchema), UserProfileService.getManyBlogs);

router
  .route("/search")
  .get(passportJWT, validateQueryString(schemas.searchCriteriaSchema), UserProfileService.searchMany);

router
  .route("/loggedIn")
  .get(passportJWT, UserProfileService.getLoggedIn);

router
  .route("/userProfile/:userProfileId")
  .get(passportJWT, validateParam(schemas.idSchema, "userProfileId"), UserProfileService.getOne);

router
  .route("/userProfile/:userProfileId/trust")
  .post(passportJWT, validateParam(schemas.idSchema, "userProfileId"), validateBody(schemas.trustSchema), UserProfileService.upsertTrust);

module.exports = router;
