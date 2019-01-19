const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeVoteSchema = new Schema({
    authorId: String,  //prvo njega trazim, pa ako ne postoji stvorim ga. ako postoji update ga
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