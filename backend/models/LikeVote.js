const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeVoteSchema = new Schema({
  _id: { type: String, required: true },
  voteCountUp: { type: Number, default: 0 },
  voteCountDown: { type: Number, default: 0 },
});

const LikeVote = mongoose.model("likeVote", likeVoteSchema);
module.exports = LikeVote;