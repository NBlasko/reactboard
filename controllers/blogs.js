const Blog = require('../models/blog');
const Comment = require('../models/comment');
const LikeVote = require('../models/likeVote');
const ImagesGallery = require('../models/imagesGallery');
const User = require('../models/auth');


module.exports = {

    index: async (req, res, next) => {
        //  console.log("req", req.value.query)
        let { skip, criteria } = req.value.query;
        let newCriteria = { "date": -1 }
        if (criteria === "mostseenblogs") newCriteria = { "statistics.seen": -1 };
        if (criteria === "mostlikedblogs") newCriteria = { "difference": -1 };
        if (criteria === "new") newCriteria = { "date": -1 };
        skip = parseInt(skip)
        const blogs = await Blog
            .find({}, "statistics title author body publicID authorsPublicID date difference image.galleryMongoID")
            .populate({ path: 'statistics.trustVote statistics.likeVote', select: "number" })
            .skip(skip)
            .limit(5)
            .sort(newCriteria)


        //kasnije cu izbaciti odredjene stvari za response, ne sme sve da se vrati
        //authorsPublicID  zadrzavam u blog kako bih napravio link koji vodi ka profilu tog authora
        let result = [], bodySliced;
        blogs.forEach((v) => {
            //  console.log("v", v)
            const { statistics, title, author, body, publicID, authorsPublicID, date } = v;
            if (body.length > 100) bodySliced = body.slice(0, 100) + "...";
            else bodySliced = body;
            const image = (v.image) ? v.image.galleryMongoID : null
            result.push({
                statistics,
                title,
                author,
                body: bodySliced,
                publicID,
                authorsPublicID,
                date,
                image
            })
        });
        res.status(200).json(result);
    },


    searchBlogs: async (req, res, next) => {
        console.log("reqSearch", req.value.query.searchText)
        let { searchText } = req.value.query;
        const regexSearch = new RegExp(searchText, "i");
        const blogs = await Blog
            .find({ title: regexSearch }, "statistics title author body publicID authorsPublicID date difference image.galleryMongoID")
            .populate({ path: 'statistics.trustVote statistics.likeVote', select: "number" })
            .limit(10)
            .sort({ "date": -1 })


        //kasnije cu izbaciti odredjene stvari za response, ne sme sve da se vrati
        //authorsPublicID  zadrzavam u blog kako bih napravio link koji vodi ka profilu tog authora
        let result = [], bodySliced;
        blogs.forEach(function (v) {
            //     console.log("v", v)
            const { statistics, title, author, body, publicID, authorsPublicID, date } = v;
            if (body.length > 100) bodySliced = body.slice(0, 100) + "...";
            else bodySliced = body;
            const image = (v.image) ? v.image.galleryMongoID : null;

            const filteredStatistics = {
                likeVote: {
                    number:
                    {
                        Up: statistics.likeVote.number.Up,
                        Down: statistics.likeVote.number.Down
                    }
                },
                trustVote: {
                    number:
                    {
                        Up: statistics.trustVote.number.Up,
                        Down: statistics.trustVote.number.Down
                    }
                },
                numberOfComments: statistics.numberOfComments,
                seen: statistics.seen

            }
            result.push({ statistics: filteredStatistics, title, author, body: bodySliced, publicID, authorsPublicID, date, image })
        });
        res.status(200).json({ result });
    },



    newBlog: async (req, res, next) => {
        const likeVote = await new LikeVote({
            authorId: req.user.publicID
        })
        await likeVote.save();



        const { imageId } = req.value.body;
        //  console.log("loggg", req.user)

        const gallery = await ImagesGallery.findOne({ authorId: req.user.publicID })//.select({ images: {$elemMatch: {_id: id}} } )
        if (!gallery) return res.status(404).json({ error: "image doesn\'t exist or forbidden" });


        let imageObject = await gallery.images.find(x => x._id == imageId)

        //   console.log("blog imageID", req.value.body, "imageObject", imageObject)
        const blog = await new Blog({
            title: req.value.body.title,
            body: req.value.body.body,
            author: req.user.name,
            authorsPublicID: req.user.publicID
            //Ovde nije potrebno da se salje u body authorsId jer to stize preko passport token auth, tj ima u req.user snimljeno
        });
        await blog.save();
        if (imageObject) blog.image = {
            URL: imageObject.URL,
            imageID: imageObject.imageID,
            galleryMongoID: imageObject._id
        }
        blog.statistics.trustVote = req.user.statistics.trustVote;
        blog.statistics.likeVote = likeVote.id;
        await blog.save();

        //add coins to user Profile
        const user = await User.findOne({ publicID: req.user.publicID })
        user.statistics.coins.total += 10;
        await user.save();


        res.status(200).json({ authorsPublicID: blog.authorsPublicID, publicID: blog.publicID });   //za link ka profilu i link ka blogu
    },


    getSingleBlog: async (req, res, next) => {
        const { blogId } = req.value.params; //value is new added property created with module helpers/routeHelpers
        let blog = await Blog.findOne({ publicID: blogId })
            .populate({ path: 'statistics.trustVote statistics.likeVote'/*, select: "number"*/ });
        //  console.log("blog", blog)
        const admin = req.user.publicID === blog.authorsPublicID;
        if (req.user.statistics.coins.total < 3 && !admin)
            return res.status(403).json({ error: "You don\'t have enough coins" })

        blog.statistics.seen += 1;
        await blog.save();
        const { statistics, title, author, body, authorsPublicID, publicID, date, } = blog;

        let Up = 0,
            Down = 0,
            number = { Up: 0, Down: 0 },
            Like = 0,
            Dislike = 0,
            likeNumber = { Like: 0, Dislike: 0 };
        if (statistics.trustVote) {
            Up = statistics.trustVote.voterId.Up;
            Down = statistics.trustVote.voterId.Down;
            Up = Up.find(function (element) {
                return element.voterId === req.user.publicID
            });
            if (Up) Up = 1;
            else Up = 0;
            Down = Down.find(function (element) {
                return element.voterId === req.user.publicID
            });
            if (Down) Down = 1;
            else Down = 0;
            number = statistics.trustVote.number;
        }

        if (statistics.likeVote) {
            Like = statistics.likeVote.voterId.Up;
            Dislike = statistics.likeVote.voterId.Down;
            Like = Like.find(function (element) {
                return element.voterId === req.user.publicID
            });
            if (Like) Like = 1;
            else Like = 0;
            Dislike = Dislike.find(function (element) {
                return element.voterId === req.user.publicID
            });
            if (Dislike) Dislike = 1;
            else Dislike = 0;
            likeNumber = statistics.likeVote.number;
        }


        const reducedStatistics = {   //throw out unnecessary things to go on client side
            seen: statistics.seen,
            numberOfComments: statistics.numberOfComments,
            likeVote: {
                number: likeNumber
            },   //i ovo ce da vidimo da li ce da ostane
            trustVote: {
                number
            }
        }
        const result = { statistics: reducedStatistics, title, author, body, authorsPublicID, publicID, date, UserVotedUp: Up, UserVotedDown: Down, Like, Dislike };
        if (blog.image) result.image = blog.image.galleryMongoID;



        //remove coins from user profile
        if (!admin) {
            const user = await User.findOne({ publicID: req.user.publicID })
            user.statistics.coins.total -= 3;   //smanjicu na 3 kasnije
            await user.save();
            console.log("b1")
        }
        console.log("b2")


        res.status(200).json(result);
    },

    newBlogsComment: async (req, res, next) => {
        const { blogId } = req.value.params;
        let blog = await Blog.findOne({ publicID: blogId })

        let newComment = new Comment(req.value.body);
        newComment.blogsPublicID = blogId;

        await newComment.save(); //save new product in mongodb;
        blog.comments.push(newComment.id) // push new product into  the array of products that are property of userSchema
        blog.statistics.numberOfComments += 1;
        await blog.save(); // save modified user to mongodb 


        //add coins to user profile
        const user = await User.findOne({ publicID: req.user.publicID })
        user.statistics.coins.total += 5;
        await user.save();

        res.status(200).json({ newComment, numberOfComments: blog.statistics.numberOfComments });


    },


    getBlogsComments: async (req, res, next) => {   //ovo da aktiviram na neko dugme ili skrolovanjem na dno bloga, da dobacim komentare


        const { blogId } = req.value.params;
        const blog = await Blog.findOne({ publicID: blogId }, "authorsPublicID")
        const admin = req.user.publicID === blog.authorsPublicID;
        if (req.user.statistics.coins.total < 1 && !admin)
            return res.status(403).json({ error: "You don\'t have enough coins" })

        let { skip } = req.query
        skip = parseInt(skip)
        const comments = await Comment
            .find({ blogsPublicID: blogId })
            .skip(skip)
            .limit(5)
            .sort({ date: -1 })
        res.status(200).json(comments);
    },

    newBlogsLike: async (req, res, next) => {
        const { blogId } = req.value.params;  //izvadis iz url javni id bloga
        let blog = await Blog.findOne({ publicID: blogId }).populate({ path: 'statistics.likeVote' }); //nadjes taj blog
        let likeVote = blog.statistics.likeVote; // await LikeVote.findOne({ authorId: blog.publicID })   //trazis da li je vec neko do sada dao trust , tj da li je kolekcija obrazovana kod tog Usera

        let UserLiked = 0, UserDisliked = 0;
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
                likeVote.voterId.Up = likeVote.voterId.Up.filter(item => item.voterId !== req.user.publicID)
            }
            else {
                likeVote.voterId.Up.push({ voterId: req.user.publicID })
                likeVote.number.Up++;
                blog.difference++;
                UserLiked = 1;
            };
            if (foundDown) {
                likeVote.number.Down--;
                blog.difference++;
                UserDisliked = 0;
                likeVote.voterId.Down = likeVote.voterId.Down.filter(item => item.voterId !== req.user.publicID)
            }
        }
        if (req.value.body.like === 0) {

            if (foundDown) {
                likeVote.number.Down--;
                blog.difference++;
                UserDisliked = 0;
                likeVote.voterId.Down = likeVote.voterId.Down.filter(item => item.voterId !== req.user.publicID)
            }
            else {
                likeVote.voterId.Down.push({ voterId: req.user.publicID })
                likeVote.number.Down++;
                blog.difference--;
                UserDisliked = 1;
            };
            if (foundUp) {
                likeVote.number.Up--;
                blog.difference--;
                UserLiked = 0;
                likeVote.voterId.Up = likeVote.voterId.Up.filter(item => item.voterId !== req.user.publicID)
            }

        }
        await likeVote.save();
        await blog.save();

        /*potrebno je srediti da se smanjuju coins
        */
        const newLikeVote = {
            number: likeVote.number   //idea behind this object is to send it like in the previous version, to not mess up reducers in redux and data in components
        }
        const result = { likeVote: newLikeVote, UserLiked, UserDisliked }
        res.status(200).json(result);

    },
    deleteSingleBlog: async (req, res, next) => {
        const { blogId } = req.value.params;
        const blog = await Blog.findOne({ publicID: blogId })
        // potrebno je proveriti da li je admin za svaki od podataka

        // if (req.user.publicId === comment.authorsPublicID )
        //delete comments in blog       blogsPublicID
        console.log("authorsPublicID", req.user.publicID)
        await Comment.deleteMany({ blogsPublicID: blogId, authorsPublicID: req.user.publicID });


        //delete likevote _id: blog.statistics.likeVote._id
        await LikeVote.deleteOne({ _id: blog.statistics.likeVote._id, authorId: req.user.publicID });


        // delete blog itslef blogsPublicID
        await Blog.deleteOne({ publicID: blogId, authorsPublicID: req.user.publicID })


        //Character.deleteOne({ name: 'Eddard Stark' }, function (err) {});
        //Character.deleteMany({ name: /Stark/, age: { $gte: 18 } }, function (err) {});


        res.status(200).json({ result: "successful deletion" });
    }

}


