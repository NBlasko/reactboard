const UserProfile = require("../models/UserProfile");

module.exports = {
  /**
   * @param {String} searchText
   * @param {Number} skip
   * @param {String} sortBy
   */
  findMany: async (searchText, skip = 0, sortBy = "createdAt") => {
    const searchConditions = {};
    if (searchText && searchText.length > 2) {
      searchConditions["$text"] = { $search: searchText };
    }

    return UserProfile.find(searchConditions, "displayName imageUrl _id")
      .populate({
        path: "trustVote",
        select: "voteCountUp voteCountDown -_id",
      })
      .skip(skip)
      .limit(10)
      .sort({ [sortBy]: -1 });
  },
  findOneByUserProfileId: async (userProfileId) => {
    return UserProfile.findById(userProfileId, "displayName imageUrl userId _id")
      .populate({
        path: "trustVote",
        select: "voteCountUp voteCountDown -_id",
      })
  },
};
