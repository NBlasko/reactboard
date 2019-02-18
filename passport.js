const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const config = require('./configuration');
const User = require('./models/auth');
const bcrypt = require('bcryptjs');
const TrustVote = require('./models/trustVote');
const ImagesGallery = require('./models/imagesGallery')


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

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
  try {

    // Find the user specified in token
    const user = await User.findById(payload.sub);

    // If user doesn't exists, handle it
    if (!user) return done(null, false);

    // Otherwise, return the user
    done(null, user);
  } catch (error) {
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
    //  console.log('accessToken', accessToken);
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
      statistics: {
        trustVote: trustVote.id
      }
    });




    let image;
    //upload image on cloudinary if exists
    if (profile.photos[0].value)
      await cloudinary.v2.uploader.upload(profile.photos[0].value, uploadCloudinaryOptions,
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




//Facebook Oauth Strategy



passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: config.oauth.facebook.clientID,
  clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
  //  console.log('profile', profile);
   // console.log('accessToken', accessToken);
   // console.log('refreshToken', refreshToken);

    const existingUser = await User.findOne({ "facebook.id": profile.id });
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
      method: 'facebook',
      publicID: trustVote.authorId,
      name: profile.displayName,
      facebook: {
        id: profile.id,
        email: profile.emails[0].value,
      },
      statistics: {
        trustVote: trustVote.id
      }
    });



    let image;
    //upload image on cloudinary if exists
    if (profile.photos[0].value)
      await cloudinary.v2.uploader.upload(profile.photos[0].value, uploadCloudinaryOptions,
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



// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    // Find the user given the email
    const user = await User.findOne({ "local.email": email });

    // If not, handle it
    if (!user) return done(null, false);  // null means no error , false means no user


    // Check if the password is correct

    const passwordInDB = user.local.password;
    const isMatch = await bcrypt.compare(password, passwordInDB);

    // If not, handle it
    if (!isMatch) {
      console.log('not match');
      return done(null, false); // null means no error , false means no user
    }
    // console.log('match');
    // Otherwise, return the user
    done(null, user);  // null means no error , user means no user
  } catch (error) {
    done(error, false);  //error means error , false means no user
  }
}));