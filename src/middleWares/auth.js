const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token is invalid");
    }
    const msg = await jwt.verify(token, "RidhimaPachipulusu");
    const user = await User.findById(msg);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.send("ERROR:" + err.message);
  }
};
module.exports = { userAuth };
