const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uuidv4 = require("uuid/v4");

/* Create a schema */
const userProfileSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  displayName: String,

  trustVote: {
    type: Schema.Types.ObjectId,
    ref: "trustVote"
  },

  imageUrl: {
    type: String,
    default: ""
  },
  //imageQueryID is send via URL query instead jwt to authorize images
  imageQueryID: {
    type: String,
    default: uuidv4
  },

  imagesGallery: {
    type: Schema.Types.ObjectId,
    ref: "imagesGallery"
  }
});

// Create a model
const UserProfile = mongoose.model("userProfile", userProfileSchema);

module.exports = UserProfile;
