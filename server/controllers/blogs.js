const Blog = require('../models/blog');
const Comment = require('../models/comment');
const uuidv1 = require('uuid/v1');

module.exports = {

    index: async (req, res, next) => {

        const blogs = await Blog.find({});
        //kasnije cu izbaciti odredjene stvari za response, ne sme sve da se vrati
        res.status(200).json(blogs);
    },
    newBlog: async (req, res, next) => {
       // console.log("telo", req.body);
        //uuidv1
        const blog = await Blog.create(
            {
                ...req.value.body, publicID: uuidv1()
            }
        );
        //kasnije cu izbaciti odredjene stvari za response, ne sme sve da se vrati       
        res.status(200).json(blog);
    },
    getSingleBlog: async (req, res, next) => {
        console.log(req.params)
        const { blogId } = req.value.params; //value is new added property created with module helpers/routeHelpers
        const blog = await Blog.findOne({publicID: blogId})
        res.status(200).json(blog);
    },

    newBlogsComment: async (req, res, next) => {
        const { blogId } = req.value.params;   
        const blog = await Blog.findOne({publicID: blogId})
   
        const newComment = new Comment(req.value.body);  
        newComment.blogsPublicID = blogId;  

        await newComment.save(); //save new product in mongodb;
        blog.comments.push(newComment.id) // push new product into  the array of products that are property of userSchema
        await blog.save(); // save modified user to mongodb 
        res.status(200).json(newComment);

    },
    getBlogsComments: async (req, res, next) => {   //ovo da aktiviram na neko dugme ili skrolovanjem na dno bloga, da dobacim komentare
        const { blogId } = req.value.params;   //f
        const blog = await Blog.findOne({publicID: blogId}).populate('comments');  
        res.status(200).json(blog.comments);
    },

}
