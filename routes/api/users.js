const express = require("express");

// Router is required if you want to have routes in separeted files, not only on server.js
const router = express.Router();

const { check, validationResult } = require("express-validator/check");

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
  (req, res) => {
    // this is for checking if the POST method had any errors or not
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // if are errors on POST method, we send a 400(Bad Request) status, and send a json with those errors in an array
      return res.status(400).json({ errors: errors.array() });
    }

    res.send("User Route");
  }
);

module.exports = router;
