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
        const profile = await User.findOne({ publicID }, "statistics name publicID image")
            .populate({ path: 'statistics.trustVote', select: "number" })
        const { statistics, name, image } = profile;
        // ne secam se sta sam ovde hteo da uradim :)
        //po kliknutom linku imena klijenta da nas odvede na ovaj end point gde je profil korisnika, tipa ime statistika, blogovi
        const admin = (profile.id === req.user.id) ? true : false;
        let newStatistics = {};
        newStatistics.trustVote = statistics.trustVote;
        if (admin) newStatistics.coins = statistics.coins;
        const result = {
            statistics: newStatistics,
            name,
            admin//,
          //  image
        }
        res.status(200).json(result);
    },

    getProfileMessages: async (req, res, next) => {

        let { skip, authorsPublicID } = req.value.query;
        skip = parseInt(skip)
        const blogs = await Blog
            .find({ authorsPublicID }, "statistics title author body publicID authorsPublicID date difference")
            .populate({ path: 'statistics.trustVote statistics.likeVote', select: "number" })
            .skip(skip)
            .limit(5)
            .sort({ "date": -1 })


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


    newProfileTrust: async (req, res, next) => {
        const { publicID } = req.value.params;  //izvadis iz url javni id bloga
        let blog = await Blog.findOne({ publicID }).populate({ path: 'statistics.trustVote' }); //nadjes taj blog
        let trustVote = blog.statistics.trustVote; // await TrustVote.findOne({ authorId: blog.publicID })   //trazis da li je vec neko do sada dao trust , tj da li je kolekcija obrazovana kod tog Usera

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
