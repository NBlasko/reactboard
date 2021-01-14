const Blog = require("../models/blog");
const Comment = require("../models/comment");
const LikeVote = require("../models/likeVote");
const ImagesGallery = require("../models/imagesGallery");
const User = require("../models/User");
const uuidv4 = require("uuid/v4");

module.exports = {

  search: async (req, res, next) => {
    let { searchText, sortBy, perPage } = req.value.query;
    const searchConditions = {};
    if (searchText && searchText.length > 2) {
      searchConditions["$text"] = { $search: searchText };
    }
   // const skip = parseInt(perPage);
    const blogs = await Blog.find(searchConditions, "title description imageUrl viewCount likeCount commentsCount createdAt")
      .populate({ path: "authorsProfile", select: "displayName imageUrl trustCount _id" })
      .skip(perPage)
      .limit(10)
      .sort({ [sortBy]: -1 });

    res.status(200).json({ blogs });
  },

  create: async (req, res) => {
    const { imageId } = req.value.body;
    const user = await User.findById(req.user._id).populate({
      path: "userProfile",
      populate: {
        path: "imagesGallery",
        match: {
          "images._id": imageId
        }
      }
    });

    const likeVote = new LikeVote({ userProfileId: user.userProfile._id });
    await likeVote.save();

    const imageObject = user.userProfile.imagesGallery && user.userProfile.imagesGallery.images && user.userProfile.imagesGallery.images[0];

    const blog = new Blog({
      title: req.value.body.title,
      description: req.value.body.description,
      body: req.value.body.body,
      authorsProfile: user.userProfile
    });

    if (imageObject) {
      blog.imageUrl = imageObject.url;
    }

    blog.likeVote = likeVote.id;
    await blog.save();

    user.coins.total += 10;
    await user.save();

    res.status(200).json({ blogId: blog._id, authorsProfileId: user.userProfile._id });
  },

  getOne: async (req, res, next) => {
    const { blogId } = req.value.params; //value is new added property created with module helpers/routeHelpers
    let blog = await Blog.findOne({ publicID: blogId }).populate({ path: "trustVote likeVote" /*, select: "number"*/ });

    const admin = req.user.publicID === blog.authorsPublicID;

    if (req.user.coins.total < 3 && !admin) return res.status(403).json({ error: "You don't have enough coins" });

    blog.seen += 1;
    await blog.save();
    const { trustVote, likeVote, numberOfComments, seen, title, author, body, authorsPublicID, publicID, date } = blog;

    let Up = 0,
      Down = 0,
      number = { Up: 0, Down: 0 },
      Like = 0,
      Dislike = 0;
    //  likeNumber = { Like: 0, Dislike: 0 };
    if (trustVote) {
      Up = trustVote.voterId.Up;
      Down = trustVote.voterId.Down;
      Up = Up.find(function(element) {
        return element.voterId === req.user.publicID;
      });
      if (Up) Up = 1;
      else Up = 0;
      Down = Down.find(function(element) {
        return element.voterId === req.user.publicID;
      });
      if (Down) Down = 1;
      else Down = 0;
      number = trustVote.number;
    }

    if (likeVote) {
      Like = likeVote.voterId.Up;
      Dislike = likeVote.voterId.Down;
      Like = Like.find(function(element) {
        return element.voterId === req.user.publicID;
      });
      if (Like) Like = 1;
      else Like = 0;
      Dislike = Dislike.find(function(element) {
        return element.voterId === req.user.publicID;
      });
      if (Dislike) Dislike = 1;
      else Dislike = 0;
      //    likeNumber = likeVote.number;
    }

    const result = {
      numberOfComments,
      seen,
      likeVote: { number: likeVote.number },
      trustVote: { number },
      title,
      author,
      body,
      authorsPublicID,
      publicID,
      date,
      UserVotedUp: Up,
      UserVotedDown: Down,
      Like,
      Dislike,
      coins: {
        ...req.user.coins,
        pageQueryID: blogId
      }
    };
    //   result.coins.pageQueryID = blogId;
    if (blog.image) result.image = blog.image.galleryMongoID;

    //remove coins from user profile
    if (!admin) {
      const user = await User.findOne({ publicID: req.user.publicID });
      user.coins.total -= 3;
      user.coins.pageQueryID = blogId;
      result.coins = user.coins;
      await user.save();
    }

    res.status(200).json(result);
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

    const comments = await Comment.find({ blogsPublicID: blogId })
      .skip(skip)
      .limit(5)
      .sort({ date: -1 });
    res.status(200).json(comments);
  },

  newBlogsLike: async (req, res, next) => {
    const { blogId } = req.value.params; //izvadis iz url javni id bloga
    let blog = await Blog.findOne({ publicID: blogId }).populate({ path: "likeVote" }); //nadjes taj blog
    let likeVote = blog.likeVote; // await LikeVote.findOne({ authorId: blog.publicID })   //trazis da li je vec neko do sada dao trust , tj da li je kolekcija obrazovana kod tog Usera

    let UserLiked = 0,
      UserDisliked = 0;
    const foundUp = likeVote.voterId.Up.find(element => {
      return element.voterId === req.user.publicID;
    });
    const foundDown = likeVote.voterId.Down.find(element => {
      return element.voterId === req.user.publicID;
    });

    if (req.value.body.like === 1) {
      if (foundUp) {
        likeVote.number.Up--;
        blog.difference--;
        UserLiked = 0;
        likeVote.voterId.Up = likeVote.voterId.Up.filter(item => item.voterId !== req.user.publicID);
      } else {
        likeVote.voterId.Up.push({ voterId: req.user.publicID });
        likeVote.number.Up++;
        blog.difference++;
        UserLiked = 1;
      }
      if (foundDown) {
        likeVote.number.Down--;
        blog.difference++;
        UserDisliked = 0;
        likeVote.voterId.Down = likeVote.voterId.Down.filter(item => item.voterId !== req.user.publicID);
      }
    }
    if (req.value.body.like === 0) {
      if (foundDown) {
        likeVote.number.Down--;
        blog.difference++;
        UserDisliked = 0;
        likeVote.voterId.Down = likeVote.voterId.Down.filter(item => item.voterId !== req.user.publicID);
      } else {
        likeVote.voterId.Down.push({ voterId: req.user.publicID });
        likeVote.number.Down++;
        blog.difference--;
        UserDisliked = 1;
      }
      if (foundUp) {
        likeVote.number.Up--;
        blog.difference--;
        UserLiked = 0;
        likeVote.voterId.Up = likeVote.voterId.Up.filter(item => item.voterId !== req.user.publicID);
      }
    }
    await likeVote.save();
    await blog.save();

    /*potrebno je srediti da se smanjuju coins
     */
    const newLikeVote = {
      number: likeVote.number //idea behind this object is to send it like in the previous version, to not mess up reducers in redux and data in components
    };
    const result = { likeVote: newLikeVote, UserLiked, UserDisliked };
    res.status(200).json(result);
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
  }
};
