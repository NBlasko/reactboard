const BlogComment = require("../models/BlogComment");

module.exports = {
  /**
   * @param {String} blogId
   * @param {Number} skip
   * @param {String} sortBy
   */
  findMany: async (blogId = "", skip = 0, sortBy = "createdAt") => {
    const searchConditions = {};

    if (blogId) {
      searchConditions["blogId"] = blogId;
    }

    return BlogComment.find(searchConditions)
      .populate({
        path: "authorsProfile",
        select: "displayName imageUrl _id",
      })
      .skip(skip)
      .limit(10)
      .sort({ [sortBy]: -1 });
  },

  newEntity: (doc) => {
    return new BlogComment(doc);
  },
};
