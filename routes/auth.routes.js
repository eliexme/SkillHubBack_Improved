/* const express = require("express"); */
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/

//  POST  to signup
router.post("/signup", async (req, res, next) => {
    const salt = bcryptjs.genSaltSync(12);
    const passwordHash = bcryptjs.hashSync(req.body.password, salt);
    try {
      const existingUser = await User.findOne(
        { email: req.body.email }
      )
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email already exists" });
      } else {
        if (pwdRegex.test(req.body.password)) {
          await User.create({
          email: req.body.email,
          username: req.body.username,
          passwordHash: passwordHash,
        });
        res.status(201).json({ message: "Welcome Aboard!" });}
        else {
          return res
          .status(400)
          .json({ message: "Password should have at least 8 characters length, one letter, and one number"})
        }
        }
       
    } catch (error) {
     console.log(error)
    }
});

//  POST to login
router.post("/login", async (req, res) => {
  const potentialUser = await User.findOne({ email: req.body.email });
  if (potentialUser) {
    if (bcryptjs.compareSync(req.body.password, potentialUser.passwordHash)) {
      const authToken = jwt.sign(
        { userId: potentialUser._id },
        process.env.TOKEN_SECRET,
        { algorithm: "HS256", expiresIn: "6h" }
      );
      res.json(authToken);
    } else {
      res.status(401).json({ message: "Unable to authenticate the user" });
    }
  } else {
    res.status(401).json({ message: "User not found." });
  }
});

//  GET to Verifiy
router.get("/verify", isAuthenticated, async (req, res, next) => {
  const user = await User.findById(req.payload.userId).populate("skills subscribedEvents");
  res.status(200).json({ message: "User is authenticated", user });
});

module.exports = router;
  