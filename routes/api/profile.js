const express = require("express");
const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// Router is required if you want to have routes in separeted files, not only on server.js
const router = express.Router();

// When using router, insead of using express, you use the router from express to define your routes

// @route GET api/profile/me
// @desc  Get current user profile
// @acess Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
