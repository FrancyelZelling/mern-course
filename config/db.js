// Mongoose is required for the connection with Atlas DB
const mongoose = require("mongoose");

// Config is the package to have simple configuration separated from your code, it's handy
// Default.json is the file required to have working, and in there you store your configs
const config = require("config");

// Here we are getting the mongoURI value inside the default.json file on this same folder
const db = config.get("mongoURI");

// Now we are connecting to the database, mongoose.connect() returns a promise, and for now the instructor is using async/await to not deal with that
const connectDB = async () => {
  try {
    // This connects with the atlas DB
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log("MongoDB Connect...");
  } catch (err) {
    console.error(err.message);

    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
