const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uuidv1 = require("uuid/v1");

const trustVoteSchema = new Schema({
  userProfileId: {
    type: String,
    default: uuidv1
  },
  voteCountUp: {
    type: Number,
    default: 0
  },
  voteCountDown: {
    type: Number,
    default: 0
  },
  voterIdsUp: [
    {
      voterId: String
    }
  ],
  voterIdsDown: [
    {
      voterId: String
    }
  ]
});

const TrustVote = mongoose.model("trustVote", trustVoteSchema);
module.exports = TrustVote;
