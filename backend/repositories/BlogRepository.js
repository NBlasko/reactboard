const Blog = require("../models/Blog");

module.exports = {
  /**
   * @param {String} searchText
   * @param {Number} skip
   * @param {String} sortBy
   * @param {String} authorsProfileId
   */
  findMany: async (searchText, skip = 0, sortBy = "createdAt", authorsProfileId = "") => {
    const searchConditions = {};

    if (searchText && searchText.length > 2) {
      searchConditions["$text"] = { $search: searchText };
    }

    if (authorsProfileId) {
      searchConditions["authorsProfileId"] = authorsProfileId;
    }

    return Blog.find(searchConditions, "title description imageUrl viewCount likeCount commentsCount createdAt")
      .populate({
        path: "authorsProfile",
        select: "displayName imageUrl _id",
        populate: {
          path: "trustVote",
          select: "voteCountUp voteCountDown -_id",
        },
      })
      .populate({
        path: "likeVote",
        select: "voteCountUp voteCountDown -_id",
      })
      .skip(skip)
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
  findOneWithProfile: async (blogId) => {
    return Blog.findById(blogId, "title description body imageUrl viewCount commentsCount createdAt")
      .populate({
        path: "likeVote",
        select: "voteCountUp voteCountDown -_id",
      })
      .populate({
        path: "authorsProfile",
        select: "displayName imageUrl _id userId",
        populate: {
          path: "trustVote",
          select: "voteCountUp voteCountDown -_id",
        },
      });
  },
  /**
   *
   * @param {String} blogId
   */
  findOne: async (blogId) => {
    return Blog.findById(blogId, "title description body imageUrl viewCount commentsCount createdAt")
      .populate({
        path: "likeVote",
        select: "voteCountUp voteCountDown -_id",
      })
      .populate({
        path: "authorsProfile",
        select: "displayName imageUrl _id userId",
        populate: {
          path: "trustVote",
          select: "voteCountUp voteCountDown -_id",
        },
      });
  },
};
