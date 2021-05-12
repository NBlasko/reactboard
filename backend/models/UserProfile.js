const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectIdType = Schema.Types.ObjectId;

const userProfileSchema = new Schema({
  _id: { type: String, required: true },
  displayName: String,
  trustVote: { type: objectIdType, ref: "trustVote" },
 // trustCount: { type: Number, default: 0 }, TODO delete
  imageUrl: { type: String, default: "" },
  //imageQueryID is send via URL query instead jwt to authorize images
  // TODO, WILL be removed, strategy will be different
  // imageQueryID: {
  //   type: String,
  //   default: uuidv4
  // },
  userId: String,
});

const UserProfile = mongoose.model("userProfile", userProfileSchema);

module.exports = UserProfile;
