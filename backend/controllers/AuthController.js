const passport = require("passport");

const passportSignIn = passport.authenticate("local", { session: false });
const passportGoogle = passport.authenticate("googleToken", { session: false });
const passportFacebook = passport.authenticate("facebookToken", { session: false });
const router = require("express-promise-router")();
const AuthService = require("../services/AuthService");
const AuthValidation = require("../core/validation/AuthValidation");
const { validateBody } = require("../core/validation");

router
  .route("/auth/signup")

  .post(validateBody(AuthValidation.signUp), AuthService.signUp);

router
  .route("/auth/verify-mail")

  .post(validateBody(AuthValidation.verifyMail), AuthService.verifyMail);

router
  .route("/auth/resend-verification-mail")

  .post(validateBody(AuthValidation.resendVerificationMail), AuthService.resendVerificationMail);

router
  .route("/auth/signin")

  .post(validateBody(AuthValidation.signIn), passportSignIn, AuthService.signIn);

router
  .route("/auth/google")

  .post(passportGoogle, AuthService.googleOAuth);

router
  .route("/auth/facebook")

  .post(passportFacebook, AuthService.facebookOAuth);

module.exports = router;
