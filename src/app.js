const express = require("express");
const { connectDb } = require("./config/database");
const app = express();
const cookie = require("cookie-parser");
const authRouter = require("./router/auth");
const profileRouter = require("./router/profileRouter");
const connectionRouter=require("./router/connectionRequests");
app.use(express.json());
app.use(cookie());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/",connectionRouter);
connectDb()
  .then(() => {
    console.log("Connection established");
    app.listen(7777);
    console.log("Server islistening");
  })
  .catch((err) => {
    console.log("connection cannot be established");
  });
