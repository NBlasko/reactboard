const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* Create a schema */
const userSchema = new Schema({

  coins: {
    date: { type: Date, default: Date.now },
    total: { type: Number, default: 30 },

    /* when client want's to acces profile or blog, he is being charged.
    In turn, he gets pageQueryID
    which determines for which page has clint paid for access */

    pageQueryID: String
  },

  email: {
    type: String,
    lowercase: true
  },

  local: {
    passwordHash: String,
    /* properties for verifying via email */
    isVerified: { type: Boolean, default: false },
    accessCode: { type: String },
    accessCodeTime: { type: Date, default: Date.now },
    accessNumberTry: { type: Number, default: 3 }
  },

  googleId: { type: String },
  facebookId: { type: String },

  userProfile: {
    type: Schema.Types.ObjectId,
    ref: "userProfile"
  }
});

// Create a model
const User = mongoose.model("user", userSchema);

module.exports = User;
