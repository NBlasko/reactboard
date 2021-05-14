const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  userProfileId: { type: String, required: true },
  url: String,
  storageId: String,
});

const Image = mongoose.model("image", imageSchema);
module.exports = Image;