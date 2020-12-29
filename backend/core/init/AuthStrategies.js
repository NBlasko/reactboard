// passport
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");
const GooglePlusTokenStrategy = require("passport-google-token").Strategy;
const enviromentSetup = require("./enviromentSetup");
const User = require("../../models/User");
const UserProfile = require("../../models/UserProfile");
const TrustVote = require("../../models/trustVote");
const ImagesGallery = require("../../models/imagesGallery");
const bcrypt = require("bcryptjs");

const initAuthStrategies = () => {
  // configure cloud for images
  const cloudinary = require("cloudinary");
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });
  const uploadCloudinaryOptions = {
    folder: "reactboard",
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
  };

  // Json web token strategy
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: enviromentSetup.JWT_SECRET
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.sub);

          if (!user) {
            return done({ message: "User is not found", status: 400 }, false);
          }

          done(null, user);
        } catch (error) {
          done({ message: "Bad request", status: 400 }, false);
        }
      }
    )
  );

  // Google OAuth Strategy
  passport.use(
    "googleToken",
    new GooglePlusTokenStrategy(
      {
        clientID: enviromentSetup.oauth.google.clientID,
        clientSecret: enviromentSetup.oauth.google.clientSecret
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const foundUserByGoogleId = await User.findOne({ googleId: profile.id });

          if (foundUserByGoogleId) {
            return done(null, foundUserByGoogleId);
          }

          if (!(profile.emails[0] && profile.emails[0].value)) {
            return done({ message: "Email is not available", status: 403 }, null);
          }

          const foundUserByEmail = await User.findOne({ email: profile.emails[0].value }).populate({ path: "userProfile" });
          if (foundUserByEmail) {
            foundUserByEmail.googleId = profile.id;
            await Promise.all([foundUserByEmail.userProfile.save(), foundUserByEmail.save()]);
            return done(null, foundUserByEmail);
          }

          const trustVote = new TrustVote();
          const imagesGallery = new ImagesGallery();
          const userProfile = new UserProfile({ trustVote, displayName: profile.displayName, imagesGallery });

          const newUser = new User({
            userProfile,
            email: profile.emails[0].value,
            googleId: profile.id
          });

          // upload image on cloudinary if exists
          // let image;
          // if (profile && profile.photos && profile.photos[0].value)
          //   await cloudinary.v2.uploader.upload(profile.photos[0].value, uploadCloudinaryOptions, function(error, result) {
          //     if (error) throw error;
          //     image = {
          //       URL: result.secure_url,
          //       imageID: result.public_id
          //     };
          //   });

          // // Create ImagesGallery
          // let imagesGallery;
          // if (image) {
          //   imagesGallery = new ImagesGallery({
          //     authorId: trustVote.authorId,
          //     images: [image]
          //   });
          // } else {
          //   imagesGallery = new ImagesGallery({
          //     authorId: trustVote.authorId
          //   });
          // }

          // await imagesGallery.save();

          // if (image && image.URL) newUser.image = { URL: image.URL };

          await Promise.all([trustVote.save(), userProfile.save(), newUser.save(), imagesGallery.save()]);
          done(null, newUser);
        } catch (error) {
          done(error, false, error.message);
        }
      }
    )
  );

  // Facebook Oauth Strategy
  passport.use(
    "facebookToken",
    new FacebookTokenStrategy(
      {
        clientID: enviromentSetup.oauth.facebook.clientID,
        clientSecret: enviromentSetup.oauth.facebook.clientSecret
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("profile", profile);

          const foundUserByFacebookId = await User.findOne({ facebookId: profile.id });

          if (foundUserByFacebookId) {
            return done(null, foundUserByFacebookId);
          }

          if (!(profile.emails[0] && profile.emails[0].value)) {
            return done({ message: "Email is not available", status: 403 }, null);
          }

          const foundUserByEmail = await User.findOne({ email: profile.emails[0].value }).populate({ path: "userProfile" });
          if (foundUserByEmail) {
            foundUserByEmail.facebookId = profile.id;
            await Promise.all([foundUserByEmail.userProfile.save(), foundUserByEmail.save()]);
            return done(null, foundUserByEmail);
          }

          const trustVote = new TrustVote();
          const imagesGallery = new ImagesGallery();
          const userProfile = new UserProfile({ trustVote, displayName: profile.displayName, imagesGallery });

          const newUser = new User({
            userProfile,
            email: profile.emails[0].value,
            googleId: profile.id
          });
          // code bellow executes for initial login - create TrustVote, ImageGallery

          // Create TrustVote
          // const trustVote = new TrustVote({
          //   Up: 0,
          //   Down: 0
          // });
          // await trustVote.save();

          // // Create a new user
          // const newUser = new User({
          //   method: "facebook",
          //   publicID: trustVote.authorId,
          //   name: profile.displayName,
          //   facebook: {
          //     id: profile.id,
          //     email: profile.emails[0].value
          //   },
          //   trustVote: trustVote.id
          // });

          // upload image on cloudinary if exists
          // let image;
          // if (profile.photos[0].value)
          //   await cloudinary.v2.uploader.upload(profile.photos[0].value, uploadCloudinaryOptions, function(error, result) {
          //     if (error) throw error;
          //     image = {
          //       URL: result.secure_url,
          //       imageID: result.public_id
          //     };
          //   });

          // Create ImagesGallery
          // let imagesGallery;
          // if (image) {
          //   imagesGallery = new ImagesGallery({
          //     authorId: trustVote.authorId,
          //     images: [image]
          //   });
          // } else {
          //   imagesGallery = new ImagesGallery({
          //     authorId: trustVote.authorId
          //   });
          // }

          // await imagesGallery.save();

          // if (image.URL) newUser.image = { URL: image.URL };

          await Promise.all([trustVote.save(), userProfile.save(), newUser.save(), imagesGallery.save()]);

          done(null, newUser);
        } catch (error) {
          done(error, false, error.message);
        }
      }
    )
  );

  // local strategy
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        // If user does not exist then null means no error, false means no user
        if (!user) {
          return done({ message: "User is not found", status: 400 }, null);
        }

        const { passwordHash, isVerified } = user.local;

        if (!passwordHash) {
          return done({ message: "Email strategy is not available", status: 400 }, false);
        }

        if (!isVerified) {
          return done({ message: "Email is not verified", status: 403 }, false);
        }

        const isMatch = await bcrypt.compare(password, passwordHash);
        if (!isMatch) {
          return done({ message: "Credentials do not match", status: 403 }, false);
        }

        done(null, user);
      } catch (error) {
        done({ message: "Bad request", status: 400 }, false);
      }
    })
  );
};

module.exports = {
  initAuthStrategies
};
