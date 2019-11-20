const express = require("express");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

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

// @route POST api/profile
// @desc  Create or update user profile
// @acess Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    // this is for checking if the POST method had any errors or not
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Simple Deconstruction
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Build profile object
    // This profileFields is going to DB, but we need to initialize him first
    // for setting the objects values
    const profileFields = {};
    profileFields.user = req.user.id;
    // This is a simple checking if the values exists before setting this values to DB
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      // split() will separate the string by a separator that we passes as parameter
      // trim() will remove adjacent spaces that people may insert
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    // Build social object
    // This is a simple checking if the values exists before setting this values to DB
    // But now we do this for the social media
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create profile
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
