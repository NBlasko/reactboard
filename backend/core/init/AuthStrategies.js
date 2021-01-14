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
const { uploadImage } = require("../../helpers/uploadHelpers");

const initAuthStrategies = () => {
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

          let imagesGalleryDoc = {};
          let imageUrl = "";
          if (profile && profile._json && profile._json.picture) {
            image = await uploadImage(profile._json.picture);
            if (image && image.url) {
              imagesGalleryDoc = { images: [image] };
              imageUrl = image.url;
            }
          }

          const imagesGallery = new ImagesGallery(imagesGalleryDoc);
          const trustVote = new TrustVote();
          const userProfile = new UserProfile({
            trustVote,
            displayName: profile.displayName,
            imageUrl,
            imagesGallery
          });

          const newUser = new User({
            userProfile,
            email: profile.emails[0].value,
            googleId: profile.id
          });

          userProfile.userId = newUser.id;

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
        clientSecret: enviromentSetup.oauth.facebook.clientSecret,
        profileFields: ["id", "displayName", "emails", "picture.type(normal)"]
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

          let imagesGalleryDoc = {};
          let imageUrl = "";
          const image = await uploadImage(
            `https://graph.facebook.com/${profile.id}/picture?width=200&height=200&access_token=${accessToken}`
          );
          if (image && image.url) {
            imagesGalleryDoc = { images: [image] };
            imageUrl = image.url;
          }

          const imagesGallery = new ImagesGallery(imagesGalleryDoc);
          const trustVote = new TrustVote();
          const userProfile = new UserProfile({
            trustVote,
            displayName: profile.displayName,
            imageUrl,
            imagesGallery
          });

          const newUser = new User({
            userProfile,
            email: profile.emails[0].value,
            facebookId: profile.id
          });

          userProfile.userId = newUser.id;

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
