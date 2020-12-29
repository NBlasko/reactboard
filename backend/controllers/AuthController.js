const passport = require('passport');

const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

/* wrapper router that catches errors and  "next(error)" automatically */
const router = require('express-promise-router')();

/* controllers */
const AuthService = require('../services/AuthService');

/* helpers */
const { validateBody, schemas } = require('../helpers/routeHelpers');

/* routes*/

router.route('/signup')
  /* signup with email  */
  .post(
    validateBody(schemas.authSchema),
    AuthService.signUp
  );

router.route('/verify-mail')
  /*verify email with the code that was already sent  in signup/resendVerifyMail  */
  .post(
    validateBody(schemas.verifyEmailSchema),
    AuthService.verifyMail
  );

router.route('/resend-verification-mail')
  /* if signup route does not send an email with code, send it again */
  .post(
    validateBody(schemas.emailSchema),
    AuthService.resendVerificationMail
  );

router.route('/signin')
  /* signin with email  */
  .post(
    validateBody(schemas.authSchemaSignIn),
    passportSignIn,
    AuthService.signIn
  );

router.route('/google')
  /* auth with google+ */
  .post(
    passport.authenticate('googleToken', { session: false }),
    AuthService.googleOAuth
  );

router.route('/facebook')
  /* auth with facebook  */
  .post(
    passport.authenticate('facebookToken', { session: false }),
    AuthService.facebookOAuth
  );

router.route('/secret')
  /* when user logs in, this is initial fetch for profile data, id's and so on... */
  .get(
    passportJWT,
    AuthService.secret
  );

module.exports = router;