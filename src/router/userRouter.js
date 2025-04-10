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
    }).populate(
      "fromUserId",
      "firstName lastName age gender about photoUrl skills"
    );
    res.json({
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
      .populate(
        "fromUserId",
        "firstName lastName age gender about photoUrl skills"
      )
      .populate(
        "toUserId",
        "firstName lastName age gender about photoUrl skills"
      )
      .lean();
    const data = connections.map((row) => {
      if (String(row.fromUserId._id) === String(req.user._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    res.json({ data });
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
userRouter.post("/user/remove/:toUserId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const fromUserId = loggedInUser._id;
    const toUserId = req.params.toUserId;
    const findConnection = await Request.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (findConnection.status === "accept") {
      await Request.deleteOne({ _id: findConnection._id });
      res.json({ message: "Removed connection successfully" });
    }
    throw new Error({ error: "Cannot find a connection between those users" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = userRouter;
