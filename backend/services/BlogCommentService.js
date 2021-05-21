const { BlogRepository, BlogCommentRepository, UserProfileRepository } = require("../repositories");

module.exports = {
  create: async (req, res, next) => {
    const { blogId } = req.value.params;
    let blog = await BlogRepository.findOne(blogId);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const userProfile = await UserProfileRepository.findOneByUserProfileId(req.user.userProfileId);

    const blogComment = BlogCommentRepository.newEntity({
      body: req.value.body.body,
      authorsProfile: userProfile,
      authorsProfileId: req.user.userProfileId,
      blogId: blog.id,
    });

    await blogComment.save();

    delete blogComment._doc.authorsProfile;

    blog.commentsCount += 1;

    req.user.coins.total += 5;

    await Promise.all([blog.save(), req.user.updateOne({ coins: req.user.coins })]);

    res.status(200).json({ blogComment });
  },

  getMany: async (req, res, next) => {
    const { blogId } = req.value.params;
    const { skip } = req.value.query;

    const blogComments = await BlogCommentRepository.findMany(blogId, skip);

    // const admin = req.user.publicID === blog.authorsPublicID;

    // /*variable chargedForPage is a boolean that
    //     determines is this the page you paid to view
    //     */
    // const chargedForPage = blogId === req.user.coins.pageQueryID;

    // /* no coins, and not an admin can not fetch comments */

    // /*   console.log(
    //            "!chargedForPage", !chargedForPage,
    //            "!admin", !admin
    //        )*/

    res.status(200).json({ blogComments });
  },
};
