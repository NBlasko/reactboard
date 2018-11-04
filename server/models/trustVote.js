const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv1 = require('uuid/v1');

const trustVoteSchema = new Schema({
    authorId: {
        type: String,
        default: uuidv1
    },  //prvo njega trazim, pa ako ne postoji stvorim ga. ako postoji update ga
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
/*
trustVoteSchema.virtual('difference').get(function () {
    return this.number.Up - this.number.Down;
  });
*/
  
const TrustVote = mongoose.model('trustvote', trustVoteSchema);
module.exports = TrustVote;

//kad dobijem njegov id, snimim ga u User i u svaki Blog tog usera