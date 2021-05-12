const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commonVoteSchema = new Schema({
  voterId: { type: String, required: true },
  voteCaseId: { type: String, required: true },
  value: { type: Number, default: 0 },
});

commonVoteSchema.index({ voteCaseId: 1, voterId: 1 }, { unique: true });
const CommonVote = mongoose.model("commonVote", commonVoteSchema);
module.exports = CommonVote;