const express = require("express");

// Router is required if you want to have routes in separeted files, not only on server.js
const router = express.Router();

const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// When using router, insead of using express, you use the router from express to define your routes

// @route GET api/auth
// @desc  Test route
// @acess Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route GET api/auth
// @desc  Authenticate user and get token
// @acess Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    // this is for checking if the POST method had any errors or not
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
      // if are errors on POST method, we send a 400(Bad Request) status, and send a json with those errors in an array
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // See if user exist
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      // Return jsonwebtoken
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
