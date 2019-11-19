const express = require("express");

// Router is required if you want to have routes in separeted files, not only on server.js
const router = express.Router();

const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const User = require("../../models/User");

// When using router, insead of using express, you use the router from express to define your routes

// @route POST api/users
// @desc  Register user
// @acess Public
router.post(
  "/",
  [
    // This is for validation, we check each field that the user is suposed to enter,
    // then we add some rules for verification. Note that name has to have .not() and .isEmpty() in that order to work
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    // this is for checking if the POST method had any errors or not
    const errors = validationResult(req);
    const { name, email, password } = req.body;

    if (!errors.isEmpty()) {
      // if are errors on POST method, we send a 400(Bad Request) status, and send a json with those errors in an array
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // See if user exist
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      //Get user gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt password

      // this generates a encryption for the user password
      const salt = await bcrypt.genSalt(10);

      // My understanding: now with the encryption created above, we set the user password
      // to a function that will encrypt the password of the user, and this function
      // needs the plain text password, and the encryption(salt...?)
      user.password = await bcrypt.hash(password, salt);

      // This saves the user on DB, and it saves on DB because user = new User, and User
      // is a model for mongoose, so that have acess to our DB.
      await user.save();

      // Return jsonwebtoken

      res.send("User registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
