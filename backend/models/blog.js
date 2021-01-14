const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectIdType = Schema.Types.ObjectId;
const uuidv1 = require("uuid/v1");

const blogSchema = new Schema({
  _id: { type: String, default: uuidv1 },
  authorsProfile: { type: objectIdType, ref: "userProfile" },
  title: String,
  description: String,
  body: String,
  imageUrl: String,
  viewCount: { type: Number, default: 0 },
  likeVote: { type: objectIdType, ref: "likeVote" },
  likeCount: { type: Number, default: 0 },
  comments: [{ type: objectIdType, ref: "comment" }],
  commentsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
blogSchema.index({ title: "text", description: "text" });
const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;
