const path = require("path");
const mongoose = require("mongoose");
path.join(__dirname, "../test/summary");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: path.resolve(process.cwd(), "../.env"),
  });
}

/*  mongoose-mongodb   */
mongoose.Promise = global.Promise;

const resetDb = () => {
  try {
    const mongoose = require("mongoose");

    mongoose.connect(
      process.env.MONGODB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      async (error) => {
        if (error) throw error;
        console.log("Successfully connected to database.");
        await mongoose.connection.db.dropDatabase();
        console.log(`Successfully reseted database.`);
      }
    );
  } catch (err) {
    console.log("err", err);
  }
};

resetDb();
