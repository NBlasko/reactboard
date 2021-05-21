const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const TrustVote = require("../models/TrustVote");
const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../core/init/enviromentSetup");
const bcrypt = require("bcryptjs");
const sendEmail = require("../helpers/mailHelpers");
const { v4: uuid } = require("uuid");

const signToken = (user) => {
  return JWT.sign(
    {
      iss: "Blasko",
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
    },
    JWT_SECRET
  );
};

const generateAccessCode = () => Math.random().toString().slice(2, 7);

const ACCESS_CODE_TTL = (() => {
  const tenMinutes = 10 * 60 * 1000;
  return tenMinutes;
})();

module.exports = {
  verifyMail: async (req, res) => {
    const { email, accessCode } = req.value.body;
    const dateNow = new Date().getTime();

    const foundUser = await User.findOne({ email }).populate({ path: "userProfile" });

    if (!foundUser) {
      return res.handleError(403, "User not found");
    }

    const existsLocalStrategy = foundUser && foundUser.local && foundUser.local.passwordHash;
    if (!existsLocalStrategy) {
      return res.handleError(403, "Bad request");
    }

    if (foundUser.local && foundUser.local.isVerified) {
      return res.handleError(400, "You are already verified");
    }

    if (dateNow - foundUser.local.accessCodeTime.getTime() > ACCESS_CODE_TTL) {
      return res.handleError(403, "Verification code has expired");
    }

    if (foundUser.local.accessNumberTry < 0) {
      return res.handleError(403, "You tried verifying email too many times. Resend email");
    }

    if (foundUser.local.accessCode !== accessCode) {
      foundUser.local.accessNumberTry--;
      await foundUser.save();

      if (foundUser.local.accessNumberTry < 0) {
        return res.handleError(403, "Wrong verification code. You tried too many times. Resend email");
      }

      return res.handleError(403, "Wrong verification code");
    }

    foundUser.local.isVerified = true;
    foundUser.local.accessCode = null;
    foundUser.local.accessCodeTime = null;
    foundUser.local.accessNumberTry = null;
    await foundUser.save();

    const token = signToken(foundUser);
    return res.status(200).json({ token });
  },

  resendVerificationMail: async (req, res) => {
    const { email } = req.value.body;
    const user = await User.findOne({ email }).populate({ path: "userProfile" });

    if (!user) {
      return res.handleError(400, "User not found");
    }

    const accessCode = generateAccessCode();

    if (user.local && user.local.isVerified) {
      return res.handleError(400, "You are already verified");
    }

    user.local.accessCode = accessCode;
    user.local.accessCodeTime = new Date();
    user.local.accessNumberTry = 3;

    await user.save();

    sendEmail(email, user.name, accessCode);

    res.status(204).end();
  },

  signUp: async (req, res) => {
    const { email, password, displayName } = req.value.body;

    const foundUser = await User.findOne({ email }).populate({ path: "userProfile" });

    const accessCode = generateAccessCode();
    const accessCodeTime = new Date();

    if (foundUser) {
      const existsLocalStrategy = foundUser && foundUser.local && foundUser.local.passwordHash;
      if (existsLocalStrategy) {
        return res.handleError(403, "Email is already in use");
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      foundUser.local.passwordHash = passwordHash;
      foundUser.local.accessCode = accessCode;
      foundUser.local.accessCodeTime = accessCodeTime;

      await foundUser.save();

      sendEmail(email, foundUser.name, accessCode);

      return res.status(204).end();
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userProfileId = uuid();

    const trustVote = new TrustVote({
      _id: userProfileId,
    });

    const userProfile = new UserProfile({
      _id: userProfileId,
      trustVote,
      displayName,
    });

    const newUser = new User({
      userProfile,
      userProfileId,
      email,
      local: {
        passwordHash,
        accessCode,
        accessCodeTime,
      },
    });

    userProfile.userId = newUser.id;
    await Promise.all([trustVote.save(), userProfile.save(), newUser.save()]);

    sendEmail(email, newUser.name, accessCode);

    res.status(204).end();
  },

  signIn: async (req, res) => {
    res.status(200).json({ token: signToken(req.user) });
  },

  googleOAuth: async (req, res) => {
    res.status(200).json({ token: signToken(req.user) });
  },

  facebookOAuth: async (req, res) => {
    res.status(200).json({ token: signToken(req.user) });
  },

  // changePassword service: TODO
};
