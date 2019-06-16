const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema({
        author: String,
        /* authorsPublicID is the id of a person
        who is actually  writting this comment */
        authorsPublicID: String,
        /*   blogsPublicID is here so we know on which blog to append this comment   */
        blogsPublicID: String,
        body: String,
        date: {
                type: Date,
                default: Date.now
        }

});

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;