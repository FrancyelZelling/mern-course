const express = require("express");

// Router is required if you want to have routes in separeted files, not only on server.js
const router = express.Router();

// When using router, insead of using express, you use the router from express to define your routes

// @route GET api/profile
// @desc  Test route
// @acess Public
router.get("/", (req, res) => res.send("Profile Route"));

module.exports = router;
