const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trustVoteNumberSchema = new Schema({
    authorId: String,  //prvo njega trazim, pa ako ne postoji stvorim ga. ako postoji update ga
    Up: {
        type: Number,
        default: 0
    },
    Down: {
        type: Number,
        default: 0
    }
});

const TrustVoteNumber = mongoose.model('trustvotenumber', trustVoteNumberSchema);
module.exports = TrustVoteNumber;

//kad dobijem njegov id, snimim ga u User i u svaki Blog tog usera