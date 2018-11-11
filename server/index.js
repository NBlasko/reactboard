if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('./db/connection');
const request = require('request');

const app = express();

app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:3000'
}));
//app.use(passport.initialize());
app.use(express.json());


// initialize passport
app.use('/auth', require('./routes/auth'));

// secured routes
app.use('/api/blogs', require('./routes/blog'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/images', require('./routes/images'));

app.get("/api/test", function(req, res) {
    var requestSettings = {
        url: 'http://wallpapers.ae/wp-content/uploads/2014/09/Free-HD-Picture.jpeg',
        method: 'GET',
        encoding: null
    };
    request(requestSettings, function(error, response, body) {
        var base64 = Buffer.from(body).toString('base64');
        res.send(base64);
    });
});

/*
pa u react
gde je slika = res.data iz axios
 <img src={"data:image/png;base64," + this.state.slika} alt="nema nista" />
*/
/*
app.get("/api/test", function(req, res) {
    var requestSettings = {
        url: 'http://wallpapers.ae/wp-content/uploads/2014/09/Free-HD-Picture.jpeg',
        method: 'GET',
        encoding: null
    };
    
    request(requestSettings, function(error, response, body) {
        res.set('Content-Type', 'image/png');
        res.send(body);
    });
});

*/



// Catch 404 errors
app.use((req, res, next) => {

    const err = new Error('Not found');
    err.status = 404;

    next(err);
})

// Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
     if (err.http_code) {
         return res.status(200).json({err})    //this is special case for multer-cloudinary
         //it doesn't want to throw an error in usual way, so the error is sent via json with status 200
         //it happens when the format is not alowed
     }
    const status = err.status || 500;
    //respond to client

    res.status(status).json({
        error: {
            message: error.message,
        }
    });
    // respond to server
    console.error("greska5", err);

})


//start the server
const port = app.get('port') || 3001;
app.listen(port, () => { console.log(`listening on ${port}...`) });