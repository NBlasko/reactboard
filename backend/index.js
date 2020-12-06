if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const express = require('express');
//const cors = require('cors');
const morgan = require('morgan');
require('./configuration/DbConnection').initDbConnection();

const app = express();

app.use(morgan('dev'));
//app.use(cors({
//  origin: 'https://localhost:3000'
//}));

app.use(express.json());
require('./core/auth/AuthStrategies').initAuthStrategies();


app.use('/api/auth', require('./controllers/UserController'));
app.use('/api/blogs', require('./controllers/BlogController'));
app.use('/api/profiles', require('./controllers/UserProfileController'));
app.use('/api/images', require('./controllers/ImageController'));

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