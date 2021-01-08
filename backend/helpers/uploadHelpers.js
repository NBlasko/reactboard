const multer = require("multer");
const { cloudinary } = require("../core/init/StorageSetup");
const cloudinaryStorage = require("multer-storage-cloudinary");
const path = require("path");

/* Uploads an image to cloudinary  */

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "reactboard",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadCloudinaryOptions = {
  folder: "reactboard",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
};

const uploadImage = async uploadValue => {
  try {
    let image;
    await cloudinary.v2.uploader.upload(uploadValue, uploadCloudinaryOptions, function(error, result) {
      if (error) throw error;
      image = {
        url: result.secure_url,
        imageId: result.public_id
      };
    });
    return image;
  } catch (err) {
    console.log("uploadImage Error:", err);
    return null;
  }
};

const parser = multer({ storage });
module.exports = { parser, uploadImage };
