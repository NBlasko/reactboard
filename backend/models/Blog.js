const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectIdType = Schema.Types.ObjectId;
const { v4: uuid } = require("uuid");

const blogSchema = new Schema({
  _id: { type: String, default: uuid },
  authorsProfileId: { type: String, required: true },
  authorsProfile: { type: objectIdType, ref: "userProfile" },
  title: String,
  description: String,
  body: String,
  imageUrl: String,
  viewCount: { type: Number, default: 0 },
  likeVote: { type: objectIdType, ref: "likeVote" },
  commentsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

blogSchema.index({ title: "text", description: "text" });

const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;
