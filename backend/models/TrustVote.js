const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trustVoteSchema = new Schema({
  _id: { type: String, required: true },
  voteCountUp: { type: Number, default: 0 },
  voteCountDown: { type: Number, default: 0 },
});

const TrustVote = mongoose.model("trustVote", trustVoteSchema);
module.exports = TrustVote;
