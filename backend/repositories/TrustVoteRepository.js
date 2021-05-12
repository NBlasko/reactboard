const TrustVote = require("../models/TrustVote");

module.exports = {
/**
 * 
 * @param {String} trustVoteId 
 * @param {String} userId 
 * @returns {TrustVote}
 */
  findVote: async (trustVoteId, userId) => {
    return TrustVote.find({ _id: trustVoteId, "voterIdsUp.voterId": userId }, "_id");
  },
};
