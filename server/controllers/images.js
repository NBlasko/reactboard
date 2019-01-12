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

    newGalleryImage: async (req, res, next) => {

        const image = {
            URL: req.file.url,
            imageID: req.file.public_id
        };

        const galery = await ImagesGallery.findOne({ authorId: req.user.publicID })

        galery.images.push(image);

        //  console.log("niz", galery.images);
        await galery.save();
        console.log("niz", galery.images[galery.images.length - 1]);
        res.status(200).json({ id: galery.images[galery.images.length - 1]._id });
    },


    singleImage: async (req, res, next) => {
           console.log("stizem query", req.query)
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

    gallerylist: async (req, res, next) => {

        let { skip, authorsPublicID } = req.value.query;
        skip = parseInt(skip)
        const gallery = await ImagesGallery.findOne({ authorId: authorsPublicID }, "images._id")
         
        const l = gallery.images.length;
        const a = (l-skip-5 >= 0) ? l-skip-5 : 0;
        const sliced = gallery.images.slice(a, l-skip)
        

        res.status(200).json({ galleryList: sliced.reverse() });
    },
    singleGalleryImage: async (req, res, next) => {

        const { imageQueryID, publicID, singleImageID } = req.query;
        // console.log("query",req.query)
        const admin = await User.findOne({ imageQueryID: imageQueryID })
        //  console.log("a", admin)
        if (!admin)
            return res.status(403).json({ err: "Forbidden" })

        const gallery = await ImagesGallery.findOne({ authorId: publicID }).select({ images: { $elemMatch: { _id: singleImageID } } })
        // console.log("gallery",gallery)
        if (!(gallery && gallery.images[0]))
            return res.status(404).json({ err: "Not found" })

        var requestSettings = {
            url: gallery.images[0].URL,
            method: 'GET',
            encoding: null
        };

        request(requestSettings, function (error, response, body) {
            //   var base64 = Buffer.from(body).toString('base64');
            res.send(body);
        });
    },

    
    deleteGalleryImage: async (req, res, next) => {
        const { id } = req.value.params;
        //  console.log("loggg", req.user)

        const gallery = await ImagesGallery.findOne({ authorId: req.user.publicID })//.select({ images: {$elemMatch: {_id: id}} } )
        if (!gallery) return res.status(404).json({ error: "image doesn\'t exist or forbidden" });


        let imageObject = await gallery.images.find(x => x._id == id)


        // console.log("posle pull gallery", gallery)
        await cloudinary.v2.uploader.destroy(imageObject.imageID, function (error, result) {
            if (error) throw error;
            gallery.images.pull(id);
        });

        await gallery.save();

        res.status(200).json({ id });
    },
    setProfileImage: async (req, res, next) => {
        const { param } = req.value.body;



        const gallery = await ImagesGallery.findOne({ authorId: req.user.publicID }).select({ images: { $elemMatch: { _id: param } } })
        if (!gallery) return res.status(404).json({ error: "image doesn\'t exist or forbidden" });
        const gpImage = gallery.images[0];
        const user = await User.findById(req.user.id)

        user.image = { URL: gpImage.URL }


        await user.save();


        res.status(200).json({ refresh: new Date().getTime()  });
    }
}
