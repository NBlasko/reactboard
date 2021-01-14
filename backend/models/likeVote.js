const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeVoteSchema = new Schema({
  userProfileId: { type: String, required: true },
  voteCountUp: { type: Number, default: 0 },
  voteCountDown: { type: Number, default: 0 },
  voterIdsUp: [{ voterId: String }],
  voterIdsDown: [{ voterId: String }]
});

const LikeVote = mongoose.model("likeVote", likeVoteSchema);
module.exports = LikeVote;