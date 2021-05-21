const { BlogRepository, UserRepository, ImageRepository, LikeVoteRepository, CommonVoteRepository } = require("../repositories");
const { v4: uuid } = require("uuid");
const { calculateAndSaveVote } = require("../helpers/voteHelpers");

module.exports = {
  search: async (req, res) => {
    let { searchText, skip, sortBy } = req.value.query;
    const blogs = await BlogRepository.findMany(searchText, skip, sortBy);

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
      authorsProfileId: user.userProfile.id,
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
    const blog = await BlogRepository.findOneWithProfile(blogId);

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

      await req.user.updateOne({
        coins: req.user.coins,
      });
    }

    res.status(200).json({ blog, coins: req.user.coins.total });
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
    // TODO update
    // const { blogId } = req.value.params;
    // const blog = await Blog.findOne({ publicID: blogId });
    // // potrebno je proveriti da li je admin za svaki od podataka

    // //delete comments in blog       blogsPublicID
    // await Comment.deleteMany({ blogsPublicID: blogId, authorsPublicID: req.user.publicID });

    // //delete likevote _id: blog.likeVote._id
    // await LikeVote.deleteOne({ _id: blog.likeVote._id, authorId: req.user.publicID });

    // // delete blog itslef blogsPublicID
    // await Blog.deleteOne({ publicID: blogId, authorsPublicID: req.user.publicID });

    res.status(200).json({ result: "successful deletion TODO UPDATE" });
  },
};
