const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trustVoteIdSchema = new Schema({
    authorId: String,  //prvo njega trazim, pa ako ne postoji stvorim ga. ako postoji update ga
    Up: [{
        voterId: String
    }],
    Down: [{
        voterId: String
    }]
});

const TrustVoteId = mongoose.model('trustvoteid', trustVoteIdSchema);
module.exports = TrustVoteId;


//ka dobijem njegov id, snimim ga u User