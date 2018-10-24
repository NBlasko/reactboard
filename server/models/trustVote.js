const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trustVoteSchema = new Schema({
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

const TrustVote = mongoose.model('trustvote', trustVoteSchema);
module.exports = TrustVote;

//kad dobijem njegov id, snimim ga u User i u svaki Blog tog usera