const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  userProfileId: { type: String, required: true },
  imageId: { type: String, required: true },
  url: String,
  storageId: String,
});
imageSchema.index({ userProfileId: 1, imageId: 1 }, { unique: true });

const Image = mongoose.model("image", imageSchema);
module.exports = Image;