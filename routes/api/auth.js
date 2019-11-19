const express = require("express");

// Router is required if you want to have routes in separeted files, not only on server.js
const router = express.Router();

const auth = require("../../middleware/auth");
const User = require("../../models/User");

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

module.exports = router;
