const passport = require("passport");

const passportSignIn = passport.authenticate("local", { session: false });
const passportGoogle = passport.authenticate("googleToken", { session: false });
const passportFacebook = passport.authenticate("facebookToken", { session: false });
const router = require("express-promise-router")();
const AuthService = require("../services/AuthService");
const AuthValidation = require("../core/validation/AuthValidation");
const { validateBody } = require("../core/validation");

router
  .route("/signup")
  .post(validateBody(AuthValidation.signUp), AuthService.signUp);

router
  .route("/verify-mail")
  .post(validateBody(AuthValidation.verifyMail), AuthService.verifyMail);

router
  .route("/resend-verification-mail")
  .post(validateBody(AuthValidation.resendVerificationMail), AuthService.resendVerificationMail);

router
  .route("/signin")
  .post(validateBody(AuthValidation.signIn), passportSignIn, AuthService.signIn);

router
  .route("/google")
  .post(passportGoogle, AuthService.googleOAuth);

router
  .route("/facebook")
  .post(passportFacebook, AuthService.facebookOAuth);

module.exports = router;
