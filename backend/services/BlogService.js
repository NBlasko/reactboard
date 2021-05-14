const Blog = require("../models/Blog");
const { BlogRepository, UserRepository, ImageRepository, LikeVoteRepository, CommonVoteRepository } = require("../repositories");
const Comment = require("../models/comment");
const LikeVote = require("../models/LikeVote");
const User = require("../models/User");
const { v4: uuid } = require("uuid");

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
    findOneByCaseAndVoter;

    const [commonBlogVote, commonTrustVote] = await Promise.all([
      CommonVoteRepository.findOneByCaseAndVoter(blogId, req.user.id),
      CommonVoteRepository.findOneByCaseAndVoter(blog.authorsProfile.userId, req.user.id),
      blog.save(),
    ]);

    blog.likeVote._doc.voteValue = commonBlogVote && commonBlogVote.value ? commonBlogVote.value : 0;
    blog.authorsProfile.trustVote._doc.voteValue = commonTrustVote && commonTrustVote.value ? commonTrustVote.value : 0;
    delete blog.authorsProfile._doc.userId;

    // result.coins.pageQueryID = blogId;
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

  newBlogsLike: async (req, res, next) => {
    const { blogId } = req.value.params; //izvadis iz url javni id bloga
    let blog = await Blog.findOne({ publicID: blogId }).populate({ path: "likeVote" }); //nadjes taj blog
    let likeVote = blog.likeVote; // await LikeVote.findOne({ authorId: blog.publicID })   //trazis da li je vec neko do sada dao trust , tj da li je kolekcija obrazovana kod tog Usera

    let UserLiked = 0,
      UserDisliked = 0;
    const foundUp = likeVote.voterId.Up.find((element) => {
      return element.voterId === req.user.publicID;
    });
    const foundDown = likeVote.voterId.Down.find((element) => {
      return element.voterId === req.user.publicID;
    });

    if (req.value.body.like === 1) {
      if (foundUp) {
        likeVote.number.Up--;
        blog.difference--;
        UserLiked = 0;
        likeVote.voterId.Up = likeVote.voterId.Up.filter((item) => item.voterId !== req.user.publicID);
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
        likeVote.voterId.Down = likeVote.voterId.Down.filter((item) => item.voterId !== req.user.publicID);
      }
    }
    if (req.value.body.like === 0) {
      if (foundDown) {
        likeVote.number.Down--;
        blog.difference++;
        UserDisliked = 0;
        likeVote.voterId.Down = likeVote.voterId.Down.filter((item) => item.voterId !== req.user.publicID);
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
        likeVote.voterId.Up = likeVote.voterId.Up.filter((item) => item.voterId !== req.user.publicID);
      }
    }
    await likeVote.save();
    await blog.save();

    /*
    
    potrebno je srediti da se smanjuju coins
    
    */
    const newLikeVote = {
      number: likeVote.number, //idea behind this object is to send it like in the previous version, to not mess up reducers in redux and data in components
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
  },
};
