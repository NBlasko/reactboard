const CommonVote = require("../models/CommonVote");

module.exports = {
  /**
   * @param {String} voteCaseId -> (userId & trustId)  | (blogId & likeId)
   * @param {String} voterId -> loggedIn userId
   */
  findOneByCaseAndVoter: async (voteCaseId, voterId) => {
    return CommonVote.findOne({ voteCaseId, voterId });
  },

  newEntity: (doc) => {
    return new CommonVote(doc);
  },
};
