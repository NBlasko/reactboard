/* mongoose models */
const User = require('../models/auth');
const TrustVote = require('../models/trustVote');
const ImagesGallery = require('../models/imagesGallery');

/* jsonwebtoken */
const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../configuration');
const bcrypt = require('bcryptjs');

/* helpers */
const sendEmail = require('../helpers/mailHelpers')


signToken = user => {
  return JWT.sign({
    iss: 'Blasko',  //later www.blasko.com or something similiar
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}

/* All responses are checked, none of them retrives more than it should */

module.exports = {

  verifyMail: async (req, res, next) => {
    // console.log("req.value", req.value.body)

    const { email, accessCode } = req.value.body;
    const dateNow = new Date().getTime();
    const difference10Min = 600000;  // 10 min in ms

    /* handle possible errors  */
    const foundUser = await User.findOne({ "local.email": email });
    if (!foundUser)
      return res.status(403).json({ error: "Email is not in database" })

    /*  if User is already verified, this should not happen, BUT, never trust a client side :) */
    if (foundUser.local && foundUser.local.verified) {
      return res.status(400).json({ error: "You are already verified" })
    }

    if (dateNow - foundUser.local.accessCodeTime.getTime() > difference10Min)
      return res.status(403).json({ error: "Verification code has expired" })

    if (foundUser.local.accessNumberTry < 0)
      return res.status(403).json({
        error: "You tried verifying email too many times. Resend email"
      })

    /* if wrong access code is entered   */
    if (foundUser.local.accessCode !== accessCode) {
      foundUser.local.accessNumberTry--;
      await foundUser.save();

      if (foundUser.local.accessNumberTry < 0)
        return res.status(403).json({
          error: "Wrong verification code. You tried too many times. Resend email"
        })

      return res.status(403).json({ error: "Wrong verification code" })
    }

    /* if everything has been done correctly */
    foundUser.local.verified = true;
    foundUser.local.accessCode = null;
    foundUser.local.accessCodeTime = null;
    foundUser.local.accessNumberTry = null;
    await foundUser.save();

    /* Generate the token  */
    const token = signToken(foundUser);

    /*  Respond with token  */
    return res.status(200).json({ token })


  },
  resendVerificationMail: async (req, res, next) => {
    const { email } = req.value.body;
    const user = await User.findOne({ "local.email": email });
    if (!user) return res.status(403).json({ error: 'Email is not in database' });
    const accessCode = Math.random().toString().slice(2, 7);
    user.local.accessCode = accessCode;
    user.local.accessCodeTime = new Date();
    user.local.accessNumberTry = 3;
    await user.save();
    console.log("accessCode", accessCode)

    /*sendEmail(to, name, code)  */
    sendEmail(email, user.name, accessCode);

    res.status(204).end()
  },

  signUp: async (req, res, next) => {
    const { email, password, name } = req.value.body;

    /* Check if there is a user with the same email  */
    const foundUser = await User.findOne({ "local.email": email });
    if (foundUser)
      return res.status(403).json({ error: 'Email is already in use' });


    /* Create TrustVote  */
    trustVote = new TrustVote({
      Up: 0,
      Down: 0
    });
    await trustVote.save();

    /* Create ImagesGallery  */
    const imagesGallery = new ImagesGallery({
      authorId: trustVote.authorId
    })
    await imagesGallery.save();

    /*  accessCode is for email verification */
    const accessCode = Math.random().toString().slice(2, 7);

    /* Create a new user  */
    const newUser = new User({
      method: 'local',
      publicID: trustVote.authorId,
      name: name,
      local: {
        email: email,
        password: password,
        accessCode: accessCode
      },
      trustVote: trustVote.id
    });

    /* Generate salt  */
    const salt = await bcrypt.genSalt(10);

    /* Generate a password hash (salt + hash)  */
    const passwordHash = await bcrypt.hash(newUser.local.password, salt);

    /* Re-assign hashed version over original, plain text password  */
    newUser.local.password = passwordHash;

    /* save newUser with hashed password */
    await newUser.save();

    console.log("accessCode", accessCode)

    /*sendEmail(to, name, code)  */
    sendEmail(email, newUser.name, accessCode);

    res.status(204).end();
  },

  signIn: async (req, res, next) => {
    if (!req.user.local.verified)
      return res.status(403).json({ error: "email is not verified" });
    
      /* Generate token */
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  googleOAuth: async (req, res, next) => {
    
    /* Generate token */
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  facebookOAuth: async (req, res, next) => {
    
    /* Generate token */
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  secret: async (req, res, next) => {
    //   console.log("secret",req.user)
    
    res.json({
      name: req.user.name,
      publicID: req.user.publicID,
      imageQueryID: req.user.imageQueryID
    });
  }
}