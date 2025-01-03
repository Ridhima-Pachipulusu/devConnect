const express = require("express");
const connectionRouter = express.Router();
const { userAuth } = require("../middleWares/auth");
const Request = require("../models/connectionRequest");
const User = require("../models/user");
connectionRouter.post(
  "/request/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const status = req.params.status;
      const toUserId = req.params.toUserId;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type");
      }
      const existingRequest = await Request.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        throw new Error("Connection request already exists");
      }
      if (String(fromUserId) === toUserId) {
        throw new Error("You cannot send request to yourself");
      }
      const findTo = await User.findById(toUserId);
      if (!findTo) {
        throw new Error("Request to the user who is not in DB");
      }
      const newRequest = new Request({
        fromUserId,
        toUserId,
        status,
      });
      await newRequest.save();
      res.send("Connection sent successfully");
    } catch (err) {
      res.send("Error:" + err.message);
    }
  }
);
module.exports = connectionRouter;
