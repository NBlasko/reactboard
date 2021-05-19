const TrustVote = require("../models/TrustVote");

module.exports = {
/**
 * 
 * @param {String} trustVoteId 
 * @returns {TrustVote}
 */
  findVote: async (trustVoteId) => {
    return LikeVote.findById(trustVoteId);
  },
};
