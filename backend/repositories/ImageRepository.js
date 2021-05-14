const Image = require("../models/Image");

module.exports = {
  /**
   * @param {String} imageId
   */
  findOne: async (imageId) => {
    return Image.findById(imageId);
  },

  newEntity: (doc) => {
    return new Image(doc);
  },
};
