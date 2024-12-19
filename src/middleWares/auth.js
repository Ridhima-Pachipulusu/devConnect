const adminAuth = (req, res, next) => {
  const token = "xyz";
  const check = token === "xy";
  if (!check) {
    res.send("authentication failed");
  } else {
    next();
  }
};
module.exports = { adminAuth, };
