const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleWares/auth");
const { isUpdateValid, validateSignup } = require("../utils/validation");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
     if (!user) {
       return res.status(404).json({ error: "User not found" });
     }
    res.send(user);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    isUpdateValid(req);
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        loggedInUser[key] = req.body[key];
      }
    });

    await loggedInUser.save();
    res.send(loggedInUser);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});
module.exports = profileRouter;
