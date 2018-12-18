const JWT = require('jsonwebtoken');
const User = require('../models/auth');
const TrustVote = require('../models/trustVote');
const ImagesGallery = require('../models/imagesGallery');
const { JWT_SECRET } = require('../configuration');
const bcrypt = require('bcryptjs');


signToken = user => {
  return JWT.sign({
    iss: 'Blasko',  //later www.blasko.com or something similiar
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}


module.exports = {
  signUp: async (req, res, next) => {
    const { email, password, name } = req.value.body;

    // Check if there is a user with the same email
    const foundUser = await User.findOne({ "local.email": email });
    if (foundUser) {
      return res.status(403).json({ error: 'Email is already in use' });
    }

    // Create a new user


    trustVote = new TrustVote({
      Up: 0,
      Down: 0
    });
    await trustVote.save();

    const imagesGallery = new ImagesGallery({
      authorId: trustVote.authorId
    })
    await imagesGallery.save();

    const newUser = new User({
      method: 'local',
      publicID: trustVote.authorId,   //kasnije cu dodati i gold/tokene koji ce da se trose
      name: name,
      local: {
        email: email,
        password: password,
      },
      statistics: {
        trustVote: trustVote.id
      },
    });


    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(newUser.local.password, salt);
    // Re-assign hashed version over original, plain text password
    newUser.local.password = passwordHash;

    //save newUser with hashed password
    await newUser.save();

    // Generate the token
    const token = signToken(newUser);
    // Respond with token

    res.status(200).json({ token });
  },

  signIn: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  googleOAuth: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  facebookOAuth: async (req, res, next) => {
    // Generate token
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