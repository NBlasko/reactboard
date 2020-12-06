const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeVoteSchema = new Schema({
    authorId: String,
    number: {
        Up: {
            type: Number,
            default: 0
        },
        Down: {
            type: Number,
            default: 0
        }
    },
    voterId: {
        Up: [{
            voterId: String
        }],
        Down: [{
            voterId: String
        }]
    }
});


const LikeVote = mongoose.model('likeVote', likeVoteSchema);
module.exports = LikeVote;