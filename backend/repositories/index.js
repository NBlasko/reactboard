const BlogRepository = require("./BlogRepository");
const BlogCommentRepository = require("./BlogCommentRepository");
const ImageRepository = require("./ImageRepository");
const TrustVoteRepository = require("./TrustVoteRepository");
const LikeVoteRepository = require("./LikeVoteRepository");
const UserRepository = require("./UserRepository");
const UserProfileRepository = require("./UserProfileRepository");
const CommonVoteRepository = require("./CommonVoteRepository");

module.exports = {
  BlogCommentRepository,
  BlogRepository,
  ImageRepository,
  TrustVoteRepository,
  UserRepository,
  LikeVoteRepository,
  CommonVoteRepository,
  UserProfileRepository,
};
