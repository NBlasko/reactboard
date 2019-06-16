// passport
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');

const config = require('./configuration');

// mongoose models
const User = require('./models/auth');
const TrustVote = require('./models/trustVote');
const ImagesGallery = require('./models/imagesGallery')

const bcrypt = require('bcryptjs');

// configure cloud for images
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const uploadCloudinaryOptions = {
  folder: "reactboard",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
}

// json web token strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
  try {

    // Find the user specified in token
    const user = await User.findById(payload.sub);

    // null means no error, false means no user
    if (!user) return done(null, false);

    // null means no error, user means pass user to the next middleware via req
    done(null, user);

  } catch (error) {
    // error means error, false means no user
    done(error, false);
  }
}));


// Google OAuth Strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
  clientID: config.oauth.google.clientID,
  clientSecret: config.oauth.google.clientSecret,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Should have full user profile over here
    // console.log('profile', profile);
    // console.log('accessToken', accessToken);
    // console.log('refreshToken', refreshToken);

    const existingUser = await User.findOne({ "google.id": profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }

    //code bellow executes for initial login - create TrustVote, ImageGallery

    // Create TrustVote
    const trustVote = new TrustVote({
      Up: 0,
      Down: 0
    });
    await trustVote.save();

    // Create a new user
    const newUser = new User({
      method: 'google',
      publicID: trustVote.authorId,
      name: profile.displayName,
      google: {
        id: profile.id,
        email: profile.emails[0].value,
      },
      trustVote: trustVote.id
    });

    // upload image on cloudinary if exists
    let image;
    if (profile.photos[0].value)
      await cloudinary.v2.uploader.upload(
        profile.photos[0].value,
        uploadCloudinaryOptions,
        function (error, result) {
          if (error) throw error;
          image = {
            URL: result.secure_url,
            imageID: result.public_id
          }
        });

    // Create ImagesGallery
    let imagesGallery
    if (image) {
      imagesGallery = new ImagesGallery({
        authorId: trustVote.authorId,
        images: [image],
      })
    }
    else {
      imagesGallery = new ImagesGallery({
        authorId: trustVote.authorId
      })
    }

    await imagesGallery.save();

    if (image.URL)
      newUser.image = { URL: image.URL }

    await newUser.save();

    done(null, newUser);
  } catch (error) {
    done(error, false, error.message);
  }
}));


// Facebook Oauth Strategy
passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: config.oauth.facebook.clientID,
  clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
     console.log('profile', profile);
    // console.log('accessToken', accessToken);
    // console.log('refreshToken', refreshToken);

    const existingUser = await User.findOne({ "facebook.id": profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }

    // code bellow executes for initial login - create TrustVote, ImageGallery

    // Create TrustVote
    const trustVote = new TrustVote({
      Up: 0,
      Down: 0
    });
    await trustVote.save();

    // Create a new user
    const newUser = new User({
      method: 'facebook',
      publicID: trustVote.authorId,
      name: profile.displayName,
      facebook: {
        id: profile.id,
        email: profile.emails[0].value,
      },
      trustVote: trustVote.id
    });

    // upload image on cloudinary if exists
    let image;
    if (profile.photos[0].value)
      await cloudinary.v2.uploader.upload(
        profile.photos[0].value,
        uploadCloudinaryOptions,
        function (error, result) {
          if (error) throw error;
          image = {
            URL: result.secure_url,
            imageID: result.public_id
          }
        });

    // Create ImagesGallery
    let imagesGallery
    if (image) {
      imagesGallery = new ImagesGallery({
        authorId: trustVote.authorId,
        images: [image],
      })
    }
    else {
      imagesGallery = new ImagesGallery({
        authorId: trustVote.authorId
      })
    }

    await imagesGallery.save();

    if (image.URL)
      newUser.image = { URL: image.URL }

    await newUser.save();
    done(null, newUser);
  } catch (error) {
    done(error, false, error.message);
  }
}));


// local strategy
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    // Find the user via email
    const user = await User.findOne({ "local.email": email });

    // If user does not exist then null means no error, false means no user
    if (!user) return done(null, false);

    // Check if the password is correct
    const passwordInDB = user.local.password;
    const isMatch = await bcrypt.compare(password, passwordInDB);

    // If not, then null means no error, false means no user
    if (!isMatch) return done(null, false);

    // null means no error, user means pass user to the next middleware via req
    done(null, user);
  } catch (error) {
    // error means error , false means no user
    done(error, false);
  }
}));