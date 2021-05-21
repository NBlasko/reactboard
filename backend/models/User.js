const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* Create a schema */
const userSchema = new Schema({
  coins: {
    date: { type: Date, default: Date.now, required: true },
    total: { type: Number, default: 30, required: true },

    /* when client want's to acces profile or blog, he is being charged.
    In turn, he gets pageQueryID
    which determines for which page has clint paid for access */

    pageQueryID: String,
  },

  email: {
    type: String,
    lowercase: true,
  },

  local: {
    passwordHash: String,
    /* properties for verifying via email */
    isVerified: { type: Boolean, default: false },
    accessCode: { type: String },
    accessCodeTime: { type: Date },
    accessNumberTry: { type: Number, default: 3 },
  },

  googleId: String,
  facebookId: String,

  userProfile: {
    type: Schema.Types.ObjectId,
    ref: "userProfile",
  },
  userProfileId: { type: String, required: true },
});

// Create a model
const User = mongoose.model("user", userSchema);

module.exports = User;
