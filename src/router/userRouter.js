const express = require("express");
const { userAuth } = require("../middleWares/auth");
const Request = require("../models/connectionRequest");
const { connect } = require("mongoose");
const User = require("../models/user");
const userRouter = express.Router();
userRouter.get("/user/connections/received", userAuth, async (req, res) => {
  try {
    const requests = await Request.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    res.json({
      message: "These people are interested in your profile",
      data: requests,
    });
  } catch (err) {
    res.send("Error " + err.message);
  }
});
userRouter.get("/user/acceptedConnections", userAuth, async (req, res) => {
  try {
    const connections = await Request.find({
      $or: [
        { toUserId: req.user._id, status: "accept" },
        { fromUserId: req.user._id, status: "accept" },
      ],
    })
      .populate("fromUserId", "firstName")
      .populate("toUserId", "firstName");
    const data = connections.map((row) => {
      if (String(row.fromUserId._id) === String(req.user._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    res.json({
      message: "These people are your connections",
      data,
    });
  } catch (err) {
    res.send("Error " + err.message);
  }
});
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connections = await Request.find({
      $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
    });
    const hideUsers = new Set();
    connections.forEach((req) => {
      hideUsers.add(req.fromUserId.toString()),
        hideUsers.add(req.toUserId.toString());
    });
    const userFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsers) } },
        { _id: { $ne: req.user._id } },
      ],
    })
      .skip(skip)
      .limit(limit);
    res.send(userFeed);
  } catch (err) {
    res.send("ERROR " + err.message);
  }
});
module.exports = userRouter;
