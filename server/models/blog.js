const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: String,
    author: String,
    publicID: String, 
    authorsPublicID: String,
    body: String,
    options: [{
        body: String,
        votes: {
            type: Number,
            default: 0
        }
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    date: { type: Date, default: Date.now },

});

const Blog = mongoose.model('blog', blogSchema);
module.exports = Blog;


