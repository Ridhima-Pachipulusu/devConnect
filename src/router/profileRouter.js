const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleWares/auth");
const { isUpdateValid, validateSignup } = require("../utils/validation");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.send("ERROR:" + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    isUpdateValid(req);
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.send("Details updated successfully");
  } catch (err) {
    res.send("ERROR:" + err.message);
  }
});
module.exports = profileRouter;
