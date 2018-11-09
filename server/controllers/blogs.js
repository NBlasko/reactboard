const Blog = require('../models/blog');
const Comment = require('../models/comment');
const LikeVote = require('../models/likeVote');


module.exports = {

    index: async (req, res, next) => {
      //  console.log("req", req.value.query)
        let { skip, criteria } = req.value.query;
        let newCriteria = {"date": -1}
        if (criteria === "mostseenblogs") newCriteria ={ "statistics.seen": -1};
        if (criteria === "mostlikedblogs") newCriteria ={ "difference": -1};
        if (criteria === "new") newCriteria ={ "date": -1};
        skip = parseInt(skip)
        const blogs = await Blog
            .find({}, "statistics title author body publicID authorsPublicID date difference")
            .populate({ path: 'statistics.trustVote statistics.likeVote', select: "number" })
            .skip(skip)
            .limit(5)
            .sort(newCriteria )


        //kasnije cu izbaciti odredjene stvari za response, ne sme sve da se vrati
        //authorsPublicID  zadrzavam u blog kako bih napravio link koji vodi ka profilu tog authora
        let result = [], bodySliced;
        blogs.forEach(function (v) {
            const { statistics, title, author, body, publicID, authorsPublicID, date } = v;
            if (body.length > 100) bodySliced = body.slice(0, 100) + "...";
            else bodySliced = body;
            result.push({ statistics, title, author, body: bodySliced, publicID, authorsPublicID, date })
        });
        res.status(200).json(result);
    },

    newBlog: async (req, res, next) => {
        const likeVote = await new LikeVote({
            authorId: req.user.publicID
        })
        await likeVote.save();
        const blog = await new Blog({
            ...req.value.body,
            author: req.user.name,
            authorsPublicID: req.user.publicID
            //Ovde nije potrebno da se salje u body authorsId jer to stize preko passport token auth, tj ima u req.user snimljeno
        });
        await blog.save();
        blog.statistics.trustVote = req.user.statistics.trustVote;
        blog.statistics.likeVote = likeVote.id;
        await blog.save();

        res.status(200).json({ authorsPublicID: blog.authorsPublicID, publicID: blog.publicID });   //za link ka profilu i link ka blogu
    },


    getSingleBlog: async (req, res, next) => {
        const { blogId } = req.value.params; //value is new added property created with module helpers/routeHelpers
        let blog = await Blog.findOne({ publicID: blogId }).populate({ path: 'statistics.trustVote statistics.likeVote'/*, select: "number"*/ });;

        blog.statistics.seen += 1;
        await blog.save();
        const { statistics, title, author, body, authorsPublicID, publicID, date, } = blog;

        let Up = 0, Down = 0, number = { Up: 0, Down: 0 },
            Like = 0, Dislike = 0, likeNumber = { Like: 0, Dislike: 0 };
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
        res.status(200).json({ newComment, numberOfComments: blog.statistics.numberOfComments });

    },


    getBlogsComments: async (req, res, next) => {   //ovo da aktiviram na neko dugme ili skrolovanjem na dno bloga, da dobacim komentare
        const { blogId } = req.value.params;   //f
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
       
        /*potrebno je srediti da
            1. ne mogu da glasaju dva puta tj da undo svoj glas   Uradjeno
            2. da se smanjuju coins
        */
        const newLikeVote = {
            number: likeVote.number   //idea behind this object is tosend it like in the previous version, to not mess up reducers in redux and data in components
        }
        const result = { likeVote: newLikeVote, UserLiked, UserDisliked }
        res.status(200).json(result);

    }

}


