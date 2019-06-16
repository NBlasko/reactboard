const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imagesGallerySchema = new Schema({
    authorId: String,
    images: [{
        URL: String,
        imageID: String
    }],
});


const ImagesGallery = mongoose.model('imagesGallery', imagesGallerySchema);
module.exports = ImagesGallery;