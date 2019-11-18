// Creates a model to send to the database
// To create a model you need to create a schema, witch holds the different fields that we want to use for this resourse(in the case, the user fields that we want to have in our DB)

const mongoose = require("mongoose");

// This is how we define our schema, we need to pass an object as a parameter, and each field we need at least an object with the type
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// mongoose.model require a name for the model, and an schema
module.exports = User = mongoose.model("user", UserSchema);
