const Blog = require('../models/blog');
const User = require('../models/auth');

const TrustVote = require('../models/trustVote');



module.exports = {

    index: async (req, res, next) => {

        //   const blogs = await Blog.find({});
        //kasnije cu izbaciti odredjene stvari za response, ne sme sve da se vrati
        res.status(200).json({ soon: "soon" });
    },

    getSingleProfile: async (req, res, next) => {
        const { publicID } = req.value.params; //value is new added property created with module helpers/routeHelpers
        let profile = await User.findOne({ publicID }, "statistics local.name publicID");  

        // ne secam se sta sam ovde hteo da uradim :)
        //  await blog.save();
        console.log('too')
        res.status(200).json(profile);
    },

    newProfileTrust: async (req, res, next) => {
        const { publicID } = req.params;  //izvadis iz url javni id bloga
        let blog = await Blog.findOne({ publicID })//.populate({ path: 'statistics.trustVoteNumber' }); //nadjes taj blog
        let trustVote = await TrustVote.findOne({ authorId: blog.authorsPublicID })   //trazis da li je vec neko do sada dao trust , tj da li je kolekcija obrazovana kod tog Usera
        if (!trustVote) {
            trustVote = new TrustVote({
                authorId: blog.authorsPublicID,
                Up: 0,
                Down: 0
            });
            await trustVote.save();
            blog.statistics.trustVote = trustVote.id;
            await blog.save();
        }
        const foundUp = trustVote.voterId.Up.find((element) => {
            return element.voterId === req.value.body.authorsID;
        });
        const foundDown = trustVote.voterId.Down.find((element) => {
            return element.voterId === req.value.body.authorsID;
        });

        if (req.value.body.trust === 1) {

            if (foundUp) {
                trustVote.number.Up--;
                trustVote.voterId.Up = trustVote.voterId.Up.filter(item => item.voterId !== req.value.body.authorsID)
            }
            else {
                trustVote.voterId.Up.push({ voterId: req.value.body.authorsID })
                trustVote.number.Up++;
            };
            if (foundDown) {
                trustVote.number.Down--;
                trustVote.voterId.Down = trustVote.voterId.Down.filter(item => item.voterId !== req.value.body.authorsID)
            }
        }
        if (req.value.body.trust === 0) {

            if (foundDown) {
                trustVote.number.Down--;
                trustVote.voterId.Down = trustVote.voterId.Down.filter(item => item.voterId !== req.value.body.authorsID)
            }
            else {
                trustVote.voterId.Down.push({ voterId: req.value.body.authorsID })
                trustVote.number.Down++;
            };
            if (foundUp) {
                trustVote.number.Up--;
                trustVote.voterId.Up = trustVote.voterId.Up.filter(item => item.voterId !== req.value.body.authorsID)
            }

        }
        await trustVote.save();

        /*potrebno je srediti da
            1. ne mogu da glasaju dva puta tj da undo svoj glas   Uradjeno
            2. da se smanjuju coins
        */
        res.status(200).json({ blog, trustVote });

    }
}
