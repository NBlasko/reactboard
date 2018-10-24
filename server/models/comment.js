const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
        author: String,
        authorsPublicID: String,  //ovo ce mi kasnije trebati. Ovo je id onog sto pise komentar
        blogsPublicID: String, //ovo je id bloga, da znam za koji blog da zalepim komentar
        body: String,
        date: { type: Date, default: Date.now }
        //za sad komentari nece biti na glasanju
});

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;