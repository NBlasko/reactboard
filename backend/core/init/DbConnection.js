const mongoose = require("mongoose");

/*  mongoose-mongodb   */
mongoose.Promise = global.Promise;
const initDbConnection = () =>
  mongoose.connect(
    process.env.MONGODB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    error => {
      if (error) throw error;
      console.log(`Successfully connected to database.`);
    }
  );

module.exports = { initDbConnection };
