const mongoose = require('mongoose');

/*  mongoose-mongodb   */
mongoose.Promise = global.Promise;
const db = mongoose.connect(
    process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    error => {
        if (error) throw error;
        console.log(`Successfully connected to database.`);
    }).catch(error => {
        console.log('database error', error);
    });

module.exports = db;
