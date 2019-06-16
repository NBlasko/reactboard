/* Mongoose models  */
const User = require('../models/auth');
const Blog = require('../models/blog')
const ImagesGallery = require('../models/imagesGallery');

/* request fetches images via url and sends them to the client */
const request = require('request');

/* configure cloud for imagess */
const cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

/* All responses are checked, none of them retrives more than it should */

module.exports = {

    newGalleryImage: async (req, res, next) => {

        const image = {
            URL: req.file.url,
            imageID: req.file.public_id
        };

        /* add uploaded image properties to ImagesGallery */
        const galery = await ImagesGallery.findOne({ authorId: req.user.publicID })
        galery.images.push(image);
        await galery.save();

        res.status(200).json({ id: galery.images[galery.images.length - 1]._id });
    },


    fetchProfileImage: async (req, res, next) => {

        const { imageQueryID, publicID } = req.value.query;

        const user = await User.findOne({ imageQueryID: imageQueryID })

        /* imageQueryId belongs to logged in user, so,  
        if user is not found, that means that imageQuery doesn/'t exist
        that way we authenticate images vith only a URL and no axios/fetch  */
        if (!user)
            return res.status(403).json({ err: "Forbidden" })

        /* in User model is stored URL of profile image, so
        we need to grab URL, then fetch image in that URL, and then 
        passed it back to the client */
        const blogsAuthor = await User.findOne({ publicID: publicID })
        if (!blogsAuthor)
            return res.status(404).json({ err: "Not found" })

        var requestSettings = {
            url: blogsAuthor.image.URL,
            method: 'GET',
            encoding: null
        };

        request(requestSettings, (error, response, body) => {

            /* 
            If you ever change your mind and decide to use 
            fetch/axios to grab image, use

                var base64 = Buffer.from(body).toString('base64');
                res.send(base64);

            otherwise, send body like now
            */

            res.send(body);
        });
    },

    gallerylist: async (req, res, next) => {

        /* fetches five id's of images in ImagesGallery model
        skip is used to skip already fetched id's  */
        let { skip } = req.value.query;
        skip = parseInt(skip)

        /* gallery is private, only admin can see it*/
        const gallery = await ImagesGallery
            .findOne({ authorId: req.user.publicID }, "images._id");

        const l = gallery.images.length;

        /*   example: if we have 18 images, it will hold
        from 14th to 18th image, then
        from 9th to 13th image, then
        from 4th to 8th image, then
        from 1st to 3rd image,   */
        const from = (l - skip - 5 >= 0) ? l - skip - 5 : 0;
        const to = l - skip;
        const sliced = gallery.images.slice(from, to)

        res.status(200).json({ galleryList: sliced.reverse() });
    },
    singleGalleryImage: async (req, res, next) => {

        const { imageQueryID, publicID, singleImageID } = req.value.query;
        const user = await User.findOne({ imageQueryID: imageQueryID })


        /*  if user is not found, that means that imageQuery doesn/'t exist
        that way we authenticate images vith only a URL and no axios/fetch  */
        if (!user)
            return res.status(403).json({ err: "Forbidden" })


        /* search galerry if there is an image URL with the given id */
        const gallery = await ImagesGallery
            .findOne({ authorId: publicID })
            .select({ images: { $elemMatch: { _id: singleImageID } } })

        if (!(gallery && gallery.images[0]))
            return res.status(404).json({ err: "Not found" })

        /*  grab URL in gallery, then fetch image in that URL,
        and then passed it back to the client */
        var requestSettings = {
            url: gallery.images[0].URL,
            method: 'GET',
            encoding: null
        };

        request(requestSettings, (error, response, body) => {
            /* 
            If you ever change your mind and decide to use 
            fetch/axios to grab image, use

                var base64 = Buffer.from(body).toString('base64');
                res.send(base64);

            otherwise, send body like now
            */
            res.send(body);
        });
    },


    deleteGalleryImage: async (req, res, next) => {

        const { id } = req.value.params;

        const gallery = await ImagesGallery.findOne({ authorId: req.user.publicID })
        if (!gallery)
            return res.status(404).json({ error: "image doesn\'t exist or forbidden" });


        let imageObject = await gallery.images.find(x => x._id == id)

        /* delete image from cloudinary using cloudinary ID */
        await cloudinary.v2.uploader.destroy(
            imageObject.imageID,
            (error, result) => {
                if (error) throw error;
                gallery.images.pull(id);
            });

        await gallery.save();
        const admin = await User.findOne({ _id: req.user._id })

        /* if deleted image was profile image
        then remove URL for profile image in user Model */
        if (admin.image.URL !== "" && admin.image.URL === imageObject.URL) {
            admin.image.URL = "";
            await admin.save();
        }

        /* remove id of image from all blogs where she was used */
        await Blog.updateMany({ 'image.galleryMongoID': id }, { image: null })

        res.status(200).json({ id });
    },

    setProfileImage: async (req, res, next) => {

        /*  find image URL in ImagesGallery model*/

        const { param } = req.value.body;

        const gallery = await ImagesGallery
            .findOne({
                authorId: req.user.publicID
            })
            .select({
                images: { $elemMatch: { _id: param } }
            });

        if (!gallery)
            return res.status(404).json({ err: "image doesn\'t exist or forbidden" });

        const gpImage = gallery.images[0];

        /*    saves image URL in User model as profile image  */
        const user = await User.findById(req.user.id)
        user.image = { URL: gpImage.URL }
        await user.save();

        /* return a number Date().getTime() so it can refresh client side
         and refetch new profile image */
        res.status(200).json({ refresh: new Date().getTime() });
    }
}
