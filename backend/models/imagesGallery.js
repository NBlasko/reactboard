const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imagesGallerySchema = new Schema({
  images: [{ url: String, storageId: String }]
});

const ImagesGallery = mongoose.model("imagesGallery", imagesGallerySchema);
module.exports = ImagesGallery;
