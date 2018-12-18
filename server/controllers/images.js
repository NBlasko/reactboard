const Blog = require('../models/blog');
const User = require('../models/auth');
const request = require('request');
const ImagesGallery = require('../models/imagesGallery');
const cloudinary = require("cloudinary");

const path = require("path");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});



module.exports = {

    index: async (req, res, next) => {

        //   const blogs = await Blog.find({});
        //kasnije cu izbaciti odredjene stvari za response, ne sme sve da se vrati
        //a da, ovo ce preko input-a search na klijentu da izabere i izlista odredjene profile korisnika po upitu
        res.status(200).json({ soon: "soon" });
    },
    newImage: async (req, res, next) => {

        const image = {
            URL: req.file.url,
            imageID: req.file.public_id
        };
        //treba proveriti ako slika vec postoji, da se obrise prethodna verzija
        const user = await User.findById(req.user.id)
        if (req.user.image.imageID) { 
            await cloudinary.v2.uploader.destroy(req.user.image.imageID,  function (error, result) {
                if (error) throw error;
                user.image = image;        
            });     
        }
        else {
            user.image = image;
        }
        await user.save();
        
      
        res.status(200).json({result: "ok"});
    },
    newGalleryImage: async (req, res, next) => {

        const image = {
            URL: req.file.url,
            imageID: req.file.public_id
        };

        const galery = await ImagesGallery.findOne({authorId: req.user.publicID})

      galery.images.push(image);
           
    
        await galery.save();
        res.status(200).json({result: "ok"});
    },
    deleteGalleryImage: async (req, res, next) => {

      //  const { id } = req.value.params;
      const galery = await ImagesGallery.findOne({authorId: req.user.publicID})
     // galery = galery.filter(item => item.id !== value)
        res.status(200).json({result: "ok"});
    },

    singleImage: async (req, res, next) => {
     //   console.log("stizem query", req.query)
        const { imageQueryID, publicID } = req.query;
        const admin = await User.findOne({ imageQueryID: imageQueryID })
      //  console.log("a", admin)
        if (!admin)
            return res.status(403).json({ err: "Forbidden" })


        const blogsAuthor = await User.findOne({ publicID: publicID })
        if (!blogsAuthor)
            return res.status(404).json({ err: "Not found" })

        var requestSettings = {
            url: blogsAuthor.image.URL,
            method: 'GET',
            encoding: null
        };
      
        request(requestSettings, function (error, response, body) {
            //   var base64 = Buffer.from(body).toString('base64');
            res.send(body);
        });
    },

}
