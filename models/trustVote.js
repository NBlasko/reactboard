const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv1 = require('uuid/v1');

const trustVoteSchema = new Schema({
    authorId: {
        type: String,
        default: uuidv1
    },
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

