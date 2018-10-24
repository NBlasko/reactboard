const Blog = require('../models/blog');
const Comment = require('../models/comment');
const TrustVote = require('../models/trustVote');
const uuidv1 = require('uuid/v1');

module.exports = {

    index: async (req, res, next) => {

        const blogs = await Blog.find({}, "statistics title author body publicID authorsPublicID date").populate({ path: 'statistics.trustVote', select: "number" });
        //kasnije cu izbaciti odredjene stvari za response, ne sme sve da se vrati
        //authorsPublicID  zadrzavam u blog kako bih napravio link koji vodi ka profilu tog authora
        let result = [];
        blogs.forEach(function (v) {
            const { statistics, title, author, body, publicID, authorsPublicID, date } = v;
            result.push({ statistics, title, author, body, publicID, authorsPublicID, date })
        });
        res.status(200).json(result);
    },
    newBlog: async (req, res, next) => {
 
        const blog = await Blog.create({ ...req.value.body, publicID: uuidv1() });      
        res.status(200).json({ authorsPublicID: blog.authorsPublicID, publicID: blog.publicID });   //za link ka profilu i link ka blogu
    },
    getSingleBlog: async (req, res, next) => {
        const { blogId } = req.value.params; //value is new added property created with module helpers/routeHelpers
        let blog = await Blog.findOne({ publicID: blogId });
        blog.statistics.seen += 1;
        await blog.save();
        const { statistics, title, author, body, authorsPublicID, publicID, date, } = blog;
        const result = { statistics, title, author, body, authorsPublicID, publicID, date };
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
        const blog = await Blog.findOne({ publicID: blogId }).populate('comments');
        res.status(200).json(blog.comments);
    },
}
