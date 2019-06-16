const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv1 = require('uuid/v1');

/* Create a schema */
const blogSchema = new Schema({
    title: String,
    author: String,
    publicID: {
        type: String,
        default: uuidv1
    },
    authorsPublicID: String,
    body: String,
    seen: {
        type: Number,
        default: 0
    },
    likeVote: {
        type: Schema.Types.ObjectId,
        ref: 'likeVote'
    },
    numberOfComments: {
        type: Number,
        default: 0
    },
    trustVote: {
        type: Schema.Types.ObjectId,
        ref: 'trustvote'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    date: { type: Date, default: Date.now },
    /* difference is helping to calculate if someone who is voting has already vote
    and what was his vote. More about this property can be read in 
    controllers/blog.js in newBlogsLike     */
    difference: {
        type: Number,
        default: 0
    },
    image: {
        URL: String,
        imageID: String,
        galleryMongoID: String
    },
});

/* Create a model */
const Blog = mongoose.model('blog', blogSchema);

module.exports = Blog;


