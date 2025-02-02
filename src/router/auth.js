const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validateSignup } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignup(req);
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const details = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await details.save();
    res.send("details stored successfully");
  } catch (err) {
    res.send("ERROR:" + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Email/Password not valid");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email/Password not valid");
    } else {
      const token = jwt.sign({ _id: user._id }, "RidhimaPachipulusu");
      res.cookie("token", token);
      res.send(user);
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successful");
});
module.exports = authRouter;
