const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv1 = require('uuid/v1');

const blogSchema = new Schema({
    title: String,
    author: String,
    publicID: {
        type: String,
        default: uuidv1
    },
    authorsPublicID: String,
    body: String,
    statistics: {
        seen: {
            type: Number,
            default: 0
        },
        likeVote: {                            //counting (.find().count()) exists in mongodb docs, so I dont need to write it as a part of a schema
            type: Schema.Types.ObjectId,
            ref: 'likeVote'
        },
        numberOfComments: {            //ovo moze u query ali je nepotrebno pregledati bazu ako mogu to da snimim u tri mala reda
            type: Number,
            default: 0
        },
        trustVote: {
            type: Schema.Types.ObjectId,
            ref: 'trustvote'
        },
    },
    comments: [{                            //counting (.find().count()) exists in mongodb docs, so I dont need to write it as a part of a schema
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    date: { type: Date, default: Date.now },   // vreme.toISOString()
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

const Blog = mongoose.model('blog', blogSchema);
module.exports = Blog;


