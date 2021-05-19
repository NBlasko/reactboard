const LikeVote = require("../models/LikeVote");

module.exports = {
  /**
   *
   * @param {String} likeVoteId
   * @returns {Promise<LikeVote>}
   */
  findVote: async (likeVoteId) => {
    return LikeVote.findById(likeVoteId);
  },
  newEntity: (doc) => {
    return new LikeVote(doc);
  },
};
