if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const express = require('express');
//const cors = require('cors');
const morgan = require('morgan');
require('./db/connection');

const app = express();

app.use(morgan('dev'));
//app.use(cors({
//  origin: 'https://localhost:3000'
//}));
//app.use(passport.initialize());
app.use(express.json());

// initialize passport
app.use('/auth', require('./routes/auth'));

// secured routes
app.use('/api/blogs', require('./routes/blog'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/images', require('./routes/images'));

// Catch 404 errors
// In production replace this one with serving the front end
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    if (err.http_code) {
        return res.status(200).json({ error: err })
        //this is special case for multer-cloudinary
        //it doesn't want to throw an error in usual way,
        //so the error is sent via json with status 200
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
    console.error("error in handler function", err);
})

//start the server
const port = app.get('port') || 3001;
app.listen(port, () => { console.log(`listening on ${port}...`) });