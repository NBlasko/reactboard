const passport = require("passport");
const passportJWT = passport.authenticate("jwt", { session: false });
const router = require("express-promise-router")();
const UserProfileService = require("../services/UserProfileService");
const { validateBody, validateParam, validateQueryString, schemas } = require("../helpers/routeHelpers");
const { UserProfileValidation } = require("../core/validation");
router
  .route("/userProfile/:userProfileId/searchBlogs")
  .get(
    passportJWT,
    validateParam(UserProfileValidation.idSchema, "userProfileId"),
    validateQueryString(UserProfileValidation.searchCriteriaSchema),
    UserProfileService.searchBlogs
  );

router
  .route("/userProfile")

  .get(passportJWT, validateQueryString(UserProfileValidation.searchCriteriaSchema), UserProfileService.search);

router
  .route("/loggedIn")

  .get(passportJWT, UserProfileService.getLoggedIn);

router
  .route("/userProfile/:userProfileId")

  .get(passportJWT, validateParam(UserProfileValidation.idSchema, "userProfileId"), UserProfileService.getOne);

router
  .route("/userProfile/:userProfileId/trust")

  .post(
    passportJWT,
    validateParam(UserProfileValidation.idSchema, "userProfileId"),
    validateBody(UserProfileValidation.trustSchema),
    UserProfileService.upsertTrust
  );

module.exports = router;
