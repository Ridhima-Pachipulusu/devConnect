const express = require("express");
const { connectDb } = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignup } = require("./utils/validation");
const bcrypt = require("bcrypt");
app.use(express.json());
app.get("/feed", async (req, res) => {
  const user = await User.find();
  try {
    if (user) {
      res.send(user);
    } else {
      res.send("User not found ");
    }
  } catch (err) {
    res.send("something went wrong");
  }
});
app.delete("/del", async (req, res) => {
  const userId = req.body.userId;
  const user = await User.findByIdAndDelete(userId);
  res.send("user deleted successsfully");
});
app.patch("/update", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  await User.findByIdAndUpdate(userId, data);
  res.send("updated successfully");
});

app.post("/signup", async (req, res) => {
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
app.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.send("Email id is not present");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.send("password is not valid");
    } else {
      res.send("Login successful");
    }
  } catch (err) {
    res.send("ERROR:" + err.message);
  }
});
connectDb()
  .then(() => {
    console.log("Connection established");
    app.listen(7777);
    console.log("Server islistening");
  })
  .catch((err) => {
    console.log("connection cannot be established");
  });
