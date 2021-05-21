const User = require("../models/User");
const TrustVote = require("../models/TrustVote");
const { UserProfileRepository, BlogRepository } = require("../repositories");
const { calculateAndSaveVote } = require("../helpers/voteHelpers");

module.exports = {
  getOne: async (req, res) => {
    const { userProfileId } = req.value.params;

    const userProfile = await UserProfileRepository.findOneByUserProfileId(userProfileId);

    if (!userProfile) {
      return res.handleError(400, "User not found");
    }

    const isLoggedInUser = userProfile.userId === req.user.id;
    delete userProfile._doc.userId;

    if (req.user.coins.total < 3 && !isLoggedInUser) {
      return res.handleError(403, "You don't have enough coins");
    }

    if (!isLoggedInUser) {
      req.user.coins.total -= 3;

      await req.user.updateOne({
        coins: req.user.coins,
      });
    }

    res.status(200).json({ userProfile });
  },

  search: async (req, res) => {
    let { searchText, skip, sortBy } = req.value.query;
    const userProfiles = await UserProfileRepository.findMany(searchText, skip, sortBy);

    res.status(200).json({ userProfiles });
  },

  searchBlogs: async (req, res) => {
    const { searchText, skip, sortBy } = req.value.query;
    const { userProfileId } = req.value.params;
    const blogs = await BlogRepository.findMany(searchText, skip, sortBy, userProfileId);

    res.status(200).json({ blogs });
  },

  upsertTrust: async (req, res) => {
    const { userProfileId } = req.value.params;
    const trustVote = await TrustVote.findById(userProfileId);

    if (!trustVote) {
      return res.handleError(400, "User not found");
    }

    const [commonVote, updatedTrustVote] = await calculateAndSaveVote({
      caseVote: trustVote,
      wantsToVoteValue: req.value.body.trust,
      userId: req.user.id,
    });

    res.status(200).json({
      voteValue: commonVote.value,
      voteCountDown: updatedTrustVote.voteCountDown,
      voteCountUp: updatedTrustVote.voteCountUp,
    });
  },

  getLoggedIn: async (req, res) => {
    const user = await User.findById(req.user._id).populate({ path: "userProfile" });

    res.json({
      coins: user.coins.total,
      imageUrl: user.userProfile.imageUrl,
      id: user.userProfile._id,
      trustVote: user.userProfile.trustVote, // todo return this populated
      displayName: user.userProfile.displayName,
      imagesGallery: user.userProfile.imagesGallery, // todo return this populated
      imageQueryID: user.userProfile.imageQueryID,
    });
  },
};
