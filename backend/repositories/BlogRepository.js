const Blog = require("../models/Blog");

module.exports = {
  /**
   * @param {String} searchText
   * @param {Number} perPage
   * @param {String} sortBy
   */
  findMany: async (searchText, perPage, sortBy) => {
    const searchConditions = {};
    if (searchText && searchText.length > 2) {
      searchConditions["$text"] = { $search: searchText };
    }
    // const skip = parseInt(perPage);
    return Blog.find(searchConditions, "title description imageUrl viewCount likeCount commentsCount createdAt")
      .populate({ path: "authorsProfile", select: "displayName imageUrl trustCount _id" })
      .skip(perPage)
      .limit(10)
      .sort({ [sortBy]: -1 });
  },

  newEntity: (doc) => {
    return new Blog(doc);
  },

  /**
   *
   * @param {String} blogId
   */
  findOne: async (blogId) => {
    return Blog.findById(blogId, "title description body imageUrl viewCount likeCount commentsCount createdAt")
      .populate({
        path: "likeVote",
        select: "voteCountUp voteCountDown -_id",
      })
      .populate({
        path: "authorsProfile",
        select: "displayName imageUrl trustCount _id userId",
        populate: {
          path: "trustVote",
          select: "voteCountUp voteCountDown -_id",
        },
      });
  },
};
