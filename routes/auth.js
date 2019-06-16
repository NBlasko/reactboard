/* Passport */
const passport = require('passport');
require('../passport');
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

/* wrapper router that catches errors and  "next(error)" automatically */
const router = require('express-promise-router')();

/* controllers */
const authController = require('../controllers/auth');

/* helpers */
const { validateBody, schemas } = require('../helpers/routeHelpers');


/* routes*/

router.route('/signup')
  /* signup with email  */
  .post(
    validateBody(schemas.authSchema),
    authController.signUp
  );

router.route('/verifymail')
  /*verify email with the code that was already sent  in signup/resendVerifyMail  */
  .post(
    validateBody(schemas.verifyEmailSchema),
    authController.verifyMail
  );

router.route('/resend-verification-mail')
  /* if signup route does not send an email with code, send it again */
  .post(
    validateBody(schemas.emailSchema),
    authController.resendVerificationMail
  );

router.route('/signin')
  /* signin with email  */
  .post(
    validateBody(schemas.authSchemaSignIn),
    passportSignIn,
    authController.signIn
  );

router.route('/google')
  /* auth with google+ */
  .post(
    passport.authenticate('googleToken', { session: false }),
    authController.googleOAuth
  );

router.route('/facebook')
  /* auth with facebook  */
  .post(
    passport.authenticate('facebookToken', { session: false }),
    authController.facebookOAuth
  );

router.route('/secret')
  /* when user logs in, this is initial fetch for profile data, id's and so on... */
  .get(
    passportJWT,
    authController.secret
  );

module.exports = router;