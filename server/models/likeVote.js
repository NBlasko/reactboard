const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeVoteSchema = new Schema({
    vote: {
        type: Number, // 1 or -1
        default: 0
    },
    voterId: String,

});

const LikeVote = mongoose.model('likeVote', likeVoteSchema);
module.exports = LikeVote;