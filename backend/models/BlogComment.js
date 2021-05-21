const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");
const Schema = mongoose.Schema;

const blogCommentSchema = new Schema({
  _id: { type: String, default: uuid },
  blogId: { type: String, required: true },
  authorsProfileId: { type: String, required: true },
  authorsProfile: { type: Schema.Types.ObjectId, ref: "userProfile" },
  body: String,
  createdAt: { type: Date, default: Date.now },
});

blogCommentSchema.index({ blogId: 1, createdAt: -1 });

const BlogComment = mongoose.model("blogComment", blogCommentSchema);
module.exports = BlogComment;
