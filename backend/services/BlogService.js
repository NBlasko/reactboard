const Blog = require("../models/Blog");
const { BlogRepository, UserRepository, ImageRepository, LikeVoteRepository, CommonVoteRepository } = require("../repositories");
const Comment = require("../models/comment");
const LikeVote = require("../models/LikeVote");
const User = require("../models/User");
const { v4: uuid } = require("uuid");
const { calculateAndSaveVote } = require("../helpers/voteHelpers");

module.exports = {
  search: async (req, res) => {
    let { searchText, perPage, sortBy } = req.value.query;
    const blogs = await BlogRepository.findMany(searchText, perPage, sortBy);

    res.status(200).json({ blogs });
  },

  create: async (req, res) => {
    const { imageId } = req.value.body;

    const [user, blogImage] = await Promise.all([
      UserRepository.findOneWithOnlyCoinsAndProfile(req.user._id),
      ImageRepository.findOne(imageId),
    ]);

    const blogId = uuid();
    const likeVote = LikeVoteRepository.newEntity({ _id: blogId });
    const blog = BlogRepository.newEntity({
      _id: blogId,
      title: req.value.body.title,
      description: req.value.body.description,
      body: req.value.body.body,
      authorsProfile: user.userProfile,
      likeVote,
    });

    if (blogImage) {
      blog.imageUrl = blogImage.url;
    }

    if (blogImage && blogImage.userProfileId !== user.userProfile._id) {
      return res.handleError(400, "Using other user image failed");
    }

    await Promise.all([blog.save(), likeVote.save()]);

    user.coins.total += 10;
    await user.save();

    res.status(200).json({ blogId: blog._id, authorsProfileId: user.userProfile._id });
  },

  getOne: async (req, res) => {
    const { blogId } = req.value.params;
    const blog = await BlogRepository.findOne(blogId);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const loggedInUser = req.user.id === blog.authorsProfile.userId;

    if (req.user.coins.total < 3 && !loggedInUser) {
      return res.status(403).json({ error: "You don't have enough coins" });
    }

    blog.viewCount += 1;

    const [commonBlogVote, commonTrustVote] = await Promise.all([
      CommonVoteRepository.findOneByCaseAndVoter(blogId, req.user.id),
      CommonVoteRepository.findOneByCaseAndVoter(blog.authorsProfile.userId, req.user.id),
      blog.save(),
    ]);

    blog.likeVote._doc.voteValue = commonBlogVote && commonBlogVote.value ? commonBlogVote.value : 0;
    blog.authorsProfile.trustVote._doc.voteValue = commonTrustVote && commonTrustVote.value ? commonTrustVote.value : 0;
    delete blog.authorsProfile._doc.userId;

    // result.coins.pageQueryID = blogId;
    // TODO add new model Schema for viewed blogs 
    // that will be erased with chron jobs
    // so users will not lose coins every time they look into the same blog
    if (!loggedInUser) {
      req.user.coins.total -= 3;

      // user.coins.pageQueryID = blogId;
      await req.user.updateOne({
        coins: req.user.coins,
      });
    }

    res.status(200).json({ blog, coins: req.user.coins.total });
  },

  newBlogsComment: async (req, res, next) => {
    const { blogId } = req.value.params;
    let blog = await Blog.findOne({ publicID: blogId });

    let newComment = new Comment(req.value.body);
    newComment.blogsPublicID = blogId;

    await newComment.save(); //save new product in mongodb;
    blog.comments.push(newComment.id); // push new product into  the array of products that are property of userSchema
    blog.numberOfComments += 1;
    await blog.save(); // save modified user to mongodb

    //add coins to user profile
    const user = await User.findOne({ publicID: req.user.publicID });
    user.coins.total += 5;
    await user.save();

    res.status(200).json({ newComment, numberOfComments: blog.numberOfComments });
  },

  getBlogsComments: async (req, res, next) => {
    //ovo da aktiviram na neko dugme ili skrolovanjem na dno bloga, da dobacim komentare

    //  console.log("req.value", req.value)
    const { blogId } = req.value.params;
    const blog = await Blog.findOne({ publicID: blogId }, "authorsPublicID");

    let { skip } = req.value.query;
    skip = parseInt(skip);
    const admin = req.user.publicID === blog.authorsPublicID;

    /*variable chargedForPage is a boolean that 
        determines is this the page you paid to view
        */
    const chargedForPage = blogId === req.user.coins.pageQueryID;

    /* no coins, and not an admin can not fetch comments */
    /*   console.log(
               "!chargedForPage", !chargedForPage,
               "!admin", !admin
           )*/

    if (!chargedForPage && !admin) return res.status(403).json({ error: "You don't have enough coins" });

    const comments = await Comment.find({ blogsPublicID: blogId }).skip(skip).limit(5).sort({ date: -1 });
    res.status(200).json(comments);
  },

  upsertLike: async (req, res) => {
    const { blogId } = req.value.params;
    const likeVote = await LikeVoteRepository.findVote(blogId);

    if (!likeVote) {
      return res.status(404).json({ error: "LikeVote not found" });
    }

    const [commonVote, updatedLikeVote] = await calculateAndSaveVote({
      caseVote: likeVote,
      wantsToVoteValue: req.value.body.like,
      userId: req.user.id,
    });

    //potrebno je srediti da se smanjuju coins ili dodaju na osnovu 
    // dodatog glasa ili ponistavanja glasa

    res.status(200).json({
      voteValue: commonVote.value,
      voteCountDown: updatedLikeVote.voteCountDown,
      voteCountUp: updatedLikeVote.voteCountUp,
    });
  },

  deleteOne: async (req, res, next) => {
    const { blogId } = req.value.params;
    const blog = await Blog.findOne({ publicID: blogId });
    // potrebno je proveriti da li je admin za svaki od podataka

    //delete comments in blog       blogsPublicID
    await Comment.deleteMany({ blogsPublicID: blogId, authorsPublicID: req.user.publicID });

    //delete likevote _id: blog.likeVote._id
    await LikeVote.deleteOne({ _id: blog.likeVote._id, authorId: req.user.publicID });

    // delete blog itslef blogsPublicID
    await Blog.deleteOne({ publicID: blogId, authorsPublicID: req.user.publicID });

    res.status(200).json({ result: "successful deletion" });
  },
};
