const Blog = require("../models/Blog");
const User = require("../models/User");
const TrustVote = require("../models/TrustVote");
const CommonVote = require("../models/CommonVote");
const uuidv4 = require("uuid/v4");

/*             **** NOTE TO MYSELF ****   
 req.value is new added property created with module helpers/routeHelpers
 allways extract properies from req.value, and not req, because, everything
 in req.value is validated
*/

module.exports = {
  getOne: async (req, res) => {
    const { publicID } = req.value.params;
    const profile = await User.findOne({ publicID }, "trustVote name publicID").populate({ path: "trustVote", select: "number" });
    const { trustVote, name } = profile;

    /* admin is a user that visit's his own profile */
    const admin = profile.id === req.user.id ? true : false;

    if (req.user.coins.total < 3 && !admin) {
      return res.status(403).json({ error: "You don't have enough coins" });
    }

    const result = {
      trustVote: {
        number: {
          ...trustVote.number,
        },
      },
      name,
      admin,
      coins: {
        total: req.user.coins.total,
        pageQueryID: publicID,
      },
    };

    /* remove coins from user profile, 
        admin is an exception */
    if (!admin) {
      const user = await User.findOne({ publicID: req.user.publicID });
      user.coins.total -= 3;
      user.coins.pageQueryID = publicID;
      await user.save();
    }
    //   console.log("getSingleProfile", result) // response is tested
    res.status(200).json(result);
  },

  searchMany: async (req, res) => {
    //   console.log("reqSearch", req.value.query.searchText)
    let { searchText } = req.value.query;
    const regexSearch = new RegExp(searchText, "i");
    const profiles = await User.find({ name: regexSearch }, "trustVote name publicID image")
      .populate({ path: "trustVote", select: "number" })
      .limit(10)
      .sort({ _id: -1 });

    //kasnije cu izbaciti odredjene stvari za response, ne sme sve da se vrati
    //PublicID  zadrzavam u listi profila kako bih napravio link koji vodi ka profilu tog authora i da nabavim sliku
    let result = [];
    profiles.forEach(function (v) {
      //   console.log("v", v)
      const { trustVote, name, publicID } = v;

      result.push({ trustVote: trustVote.number, name, publicID });
    });

    //  console.log("searchProfiles", result) // tested response
    res.status(200).json({ result });
  },

  getManyBlogs: async (req, res) => {
    //    console.log("total stiglo")

    let { skip, authorsPublicID } = req.value.query;
    const admin = req.user.publicID === authorsPublicID;

    /*variable chargedForPage is a boolean that 
        determines is this the page you paid to view
        */
    const chargedForPage = authorsPublicID === req.user.coins.pageQueryID;
    /* no coins, and not an admin can not fetch comments */

    /*    console.log(
                "authorsPublicID", authorsPublicID,
                "req.user.coins.pageQueryID", req.user.coins.pageQueryID,
                "!admin", !admin,
                "!chargedForPage", !chargedForPage
            )*/

    if (!admin && !chargedForPage) return res.status(403).json({ error: "You don't have enough coins" });

    skip = parseInt(skip);
    const blogs = await Blog.find(
      { authorsPublicID },
      `trustVote likeVote seen numberOfComments 
                title author body publicID authorsPublicID 
                date difference image.galleryMongoID`
    )
      .populate({ path: "trustVote likeVote", select: "number" })
      .skip(skip)
      .limit(5)
      .sort({ date: -1 });

    //kasnije cu izbaciti odredjene stvari za response, ne sme sve da se vrati
    //authorsPublicID  zadrzavam u blog kako bih napravio link koji vodi ka profilu tog authora
    let result = [],
      bodySliced;
    blogs.forEach(function (v) {
      const { seen, numberOfComments, trustVote, likeVote, title, author, body, publicID, authorsPublicID, date, image } = v;
      if (body.length > 100) bodySliced = body.slice(0, 100) + "...";
      else bodySliced = body;
      const imageId = image && image.galleryMongoID ? image.galleryMongoID : null;
      result.push({
        seen,
        numberOfComments,
        trustVote: {
          number: {
            ...trustVote.number,
          },
        },
        likeVote: {
          number: {
            ...likeVote.number,
          },
        },
        title,
        author,
        body: bodySliced,
        publicID,
        authorsPublicID,
        date,
        image: imageId,
      });
    });

    // console.log("getProfileMessages", result)  response tested
    res.status(200).json(result);
  },

  upsertTrust: async (req, res) => {
    const { userProfileId } = req.value.params;
    const trustVote = await TrustVote.findById(userProfileId);

    if (!trustVote) {
      return res.handleError(400, "User not found");
    }

    const commonVoteOptions = { voteCaseId: trustVote._id, voterId: userProfileId };

    let commonVote = await CommonVote.findOne(commonVoteOptions);
    if (!commonVote) {
      commonVote = new CommonVote(commonVoteOptions);
    }

    const alreadyVotedUp = commonVote && commonVote.value === 1;
    const alreadyVotedDown = commonVote && commonVote.value === -1;
    const wantsToVoteUp = req.value.body.trust === 1;
    const wantsToVoteDown = req.value.body.trust === -1;

    if (wantsToVoteUp && alreadyVotedUp) {
      commonVote.value = 0;
      trustVote.voteCountUp--;
    }

    if (wantsToVoteUp && alreadyVotedDown) {
      commonVote.value = 1;
      trustVote.voteCountDown--;
      trustVote.voteCountUp++;
    }

    if (wantsToVoteUp && !alreadyVotedDown && !alreadyVotedUp) {
      commonVote.value = 1;
      trustVote.voteCountUp++;
    }

    if (wantsToVoteDown && alreadyVotedDown) {
      commonVote.value = 0;
      trustVote.voteCountDown--;
    }

    if (wantsToVoteDown && alreadyVotedUp) {
      commonVote.value = -1;
      trustVote.voteCountDown++;
      trustVote.voteCountUp--;
    }

    if (wantsToVoteDown && !alreadyVotedDown && !alreadyVotedUp) {
      commonVote.value = -1;
      trustVote.voteCountDown++;
    }

    if (commonVote.value === 0) {
      await Promise.all([trustVote.save(), CommonVote.deleteOne(commonVoteOptions)]);
    } else {
      await Promise.all([trustVote.save(), await commonVote.save()]);
    }

    /*  
          potrebno je videti ako povecavamo coins negde, onda da ne dozvolim da nekog glasa i undo, 
          jer ce iznova dobijati coins, strategija oko toga je potrebna 
        */

    res.status(200).json({
      voteValue: commonVote.value,
      voteCountDown: trustVote.voteCountDown,
      voteCountUp: trustVote.voteCountUp,
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
