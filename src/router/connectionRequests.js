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
connectionRouter.post(
  "/request/view/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.params.requestId;
      const toUserId = req.user._id;
      const status = req.params.status;
      const allowedStatus = ["accept", "reject"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type");
      }
      const statusCheck = await Request.findOne({
        fromUserId,
        toUserId,
      });
      if (!statusCheck.status == "interested") {
        throw new Error("Status request between them is not INTERESTED");
      }
      const fromUser = await User.findById(fromUserId);
      if (!fromUser) {
        throw new Error("You got request from unknown person to the DB");
      }
      statusCheck.status = status;
      await statusCheck.save();
      res.json(`You have just ${status}ed the ${fromUser.firstName}'s request`);
    } catch (err) {
      res.send("ERROR" + err.message);
    }
  }
);
module.exports = connectionRouter;
