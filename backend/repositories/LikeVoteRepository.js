const LikeVote = require("../models/LikeVote");

module.exports = {
  newEntity: (doc) => {
    return new LikeVote(doc);
  },
};
