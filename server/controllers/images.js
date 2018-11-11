const Blog = require('../models/blog');
const User = require('../models/auth');
const request = require('request');





module.exports = {

    index: async (req, res, next) => {

        //   const blogs = await Blog.find({});
        //kasnije cu izbaciti odredjene stvari za response, ne sme sve da se vrati
        //a da, ovo ce preko input-a search na klijentu da izabere i izlista odredjene profile korisnika po upitu
        res.status(200).json({ soon: "soon" });
    },
    newImage: async (req, res, next) => {
        console.log("user", req.user)
        console.log("meesage", req.file) // to see what is returned to you
        const image = {
            URL: req.file.url,
            imageID: req.file.public_id
        };

        const user = await User.findById(req.user.id)
        user.image = image
        await user.save();
        //  Image.create(image) // save image information in database
        //     .then(newImage => res.json(newImage))
        //  .catch(err => console.log(err));

        res.status(200).json({ image });
    },

    singleImage: async (req, res, next) => {
        console.log("stizem")

        var requestSettings = {
            url: 'http://wallpapers.ae/wp-content/uploads/2014/09/Free-HD-Picture.jpeg',
            method: 'GET',
            encoding: null
        };

        request(requestSettings, function (error, response, body) {
            res.set('Content-Type', 'image/png');
            res.send(body);
        });
    },
 
}
