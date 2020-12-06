const passport = require('passport');

const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

/* wrapper router that catches errors and  "next(error)" automatically */
const router = require('express-promise-router')();

/* controllers */
const UserService = require('../services/UserService');

/* helpers */
const { validateBody, schemas } = require('../helpers/routeHelpers');


/* routes*/

router.route('/signup')
  /* signup with email  */
  .post(
    validateBody(schemas.authSchema),
    UserService.signUp
  );

router.route('/verify-mail')
  /*verify email with the code that was already sent  in signup/resendVerifyMail  */
  .post(
    validateBody(schemas.verifyEmailSchema),
    UserService.verifyMail
  );

router.route('/resend-verification-mail')
  /* if signup route does not send an email with code, send it again */
  .post(
    validateBody(schemas.emailSchema),
    UserService.resendVerificationMail
  );

router.route('/signin')
  /* signin with email  */
  .post(
    validateBody(schemas.authSchemaSignIn),
    passportSignIn,
    UserService.signIn
  );

router.route('/google')
  /* auth with google+ */
  .post(
    passport.authenticate('googleToken', { session: false }),
    UserService.googleOAuth
  );

router.route('/facebook')
  /* auth with facebook  */
  .post(
    passport.authenticate('facebookToken', { session: false }),
    UserService.facebookOAuth
  );

router.route('/secret')
  /* when user logs in, this is initial fetch for profile data, id's and so on... */
  .get(
    passportJWT,
    UserService.secret
  );

module.exports = router;