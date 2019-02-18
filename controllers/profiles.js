const Blog = require('../models/blog');
const User = require('../models/auth');





module.exports = {

    index: async (req, res, next) => {

        //   const blogs = await Blog.find({});
        //kasnije cu izbaciti odredjene stvari za response, ne sme sve da se vrati
        //a da, ovo ce preko input-a search na klijentu da izabere i izlista odredjene profile korisnika po upitu
        res.status(200).json({ soon: "soon" });
    },

    getSingleProfile: async (req, res, next) => {


        const { publicID } = req.value.params; //value is new added property created with module helpers/routeHelpers
        const profile = await User.findOne({ publicID }, "trustVote coins name publicID")
            .populate({ path: 'trustVote', select: "number" })
        const { trustVote, coins, name, image } = profile;
        // ne secam se sta sam ovde hteo da uradim :)
        //po kliknutom linku imena klijenta da nas odvede na ovaj end point gde je profil korisnika, tipa ime statistika, blogovi
        const admin = (profile.id === req.user.id) ? true : false;

        const result = {
            trustVote,
            name,
            admin//,
            //  image
        }
        if (admin) result.coins = coins;
        if (req.user.coins.total < 3 && !admin) {
            return res.status(403).json({ error: "You don\'t have enough coins" })
        }

        //remove coins from user profile
        if (!admin) {
            const user = await User.findOne({ publicID: req.user.publicID })
            user.coins.total -= 3;
            await user.save();
        }
        res.status(200).json(result);
    },
    searchProfiles: async (req, res, next) => {
        console.log("reqSearch", req.value.query.searchText)
        let { searchText } = req.value.query;
        const regexSearch = new RegExp(searchText, "i");
        const profiles = await User
            .find({ name: regexSearch }, "trustVote name publicID image")
            .populate({ path: 'trustVote', select: "number" })
            .limit(10)
            .sort({ "_id": -1 })


        //kasnije cu izbaciti odredjene stvari za response, ne sme sve da se vrati
        //PublicID  zadrzavam u listi profila kako bih napravio link koji vodi ka profilu tog authora i da nabavim sliku
        let result = [];
        profiles.forEach(function (v) {
            console.log("v", v)
            const { trustVote, name, publicID } = v;

            result.push({ trustVote: trustVote.number, name, publicID })
        });
        res.status(200).json({ result });
    },

    getProfileMessages: async (req, res, next) => {



        let { skip, authorsPublicID } = req.value.query;
        const admin = req.user.publicID === authorsPublicID
        console.log("skip", skip)
        /* no coins, and not an admin can not fetch comments */

        console.log("total< 3", req.user.coins.total < 3,
            "!admin", !admin
        )
        skip = parseInt(skip)
        if (req.user.coins.total < 3 && skip === 0 && !admin)

            return res.status(403).json({ error: "You don\'t have enough coins" })


        const blogs = await Blog
            .find({ authorsPublicID },
                `trustVote likeVote seen numberOfComments 
                title author body publicID authorsPublicID 
                date difference image.galleryMongoID`)
            .populate({ path: 'trustVote likeVote', select: "number" })
            .skip(skip)
            .limit(5)
            .sort({ "date": -1 })


        //kasnije cu izbaciti odredjene stvari za response, ne sme sve da se vrati
        //authorsPublicID  zadrzavam u blog kako bih napravio link koji vodi ka profilu tog authora
        let result = [], bodySliced;
        blogs.forEach(function (v) {
            const { seen, numberOfComments, trustVote, likeVote, title, author, body, publicID, authorsPublicID, date, image } = v;
            if (body.length > 100) bodySliced = body.slice(0, 100) + "...";
            else bodySliced = body;
            const imageId = (image && image.galleryMongoID) ? image.galleryMongoID : null;
            result.push({ seen, numberOfComments, trustVote, likeVote, title, author, body: bodySliced, publicID, authorsPublicID, date, image: imageId })
        });
        res.status(200).json(result);

    },


    newProfileTrust: async (req, res, next) => {
        const { publicID } = req.value.params;  //izvadis iz url javni id bloga
        let blog = await Blog.findOne({ publicID }).populate({ path: 'trustVote' }); //nadjes taj blog
        let trustVote = blog.trustVote; // await TrustVote.findOne({ authorId: blog.publicID })   //trazis da li je vec neko do sada dao trust , tj da li je kolekcija obrazovana kod tog Usera

        let UserVotedUp = 0, UserVotedDown = 0;
        const foundUp = trustVote.voterId.Up.find((element) => {
            return element.voterId === req.user.publicID;
        });
        const foundDown = trustVote.voterId.Down.find((element) => {
            return element.voterId === req.user.publicID;
        });

        if (req.value.body.trust === 1) {

            if (foundUp) {
                trustVote.number.Up--;
                UserVotedUp = 0;
                trustVote.voterId.Up = trustVote.voterId.Up.filter(item => item.voterId !== req.user.publicID)
            }
            else {
                trustVote.voterId.Up.push({ voterId: req.user.publicID })
                trustVote.number.Up++;
                UserVotedUp = 1;
            };
            if (foundDown) {
                trustVote.number.Down--;
                UserVotedDown = 0;
                trustVote.voterId.Down = trustVote.voterId.Down.filter(item => item.voterId !== req.user.publicID)
            }
        }
        if (req.value.body.trust === 0) {

            if (foundDown) {
                trustVote.number.Down--;
                UserVotedDown = 0;
                trustVote.voterId.Down = trustVote.voterId.Down.filter(item => item.voterId !== req.user.publicID)
            }
            else {
                trustVote.voterId.Down.push({ voterId: req.user.publicID })
                trustVote.number.Down++;
                UserVotedDown = 1;
            };
            if (foundUp) {
                trustVote.number.Up--;
                UserVotedUp = 0;
                trustVote.voterId.Up = trustVote.voterId.Up.filter(item => item.voterId !== req.user.publicID)
            }

        }
        await trustVote.save();

        /*potrebno je srediti da
            1. ne mogu da glasaju dva puta tj da undo svoj glas   Uradjeno
            2. da se smanjuju coins
        */
        const newTrustVote = {
            number: trustVote.number   //idea behind this object is tosend it like in the previous version, to not mess up reducers in redux and data in components
        }
        const result = { trustVote: newTrustVote, UserVotedUp, UserVotedDown }
        //console.log("t", trustVote.difference)  //radi


        res.status(200).json(result);

    }
}
