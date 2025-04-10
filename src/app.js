const express = require("express");
const { connectDb } = require("./config/database");
const app = express();
const cookie = require("cookie-parser");
const authRouter = require("./router/auth");
const profileRouter = require("./router/profileRouter");
const connectionRouter = require("./router/connectionRequests");
const userRouter = require("./router/userRouter");
const cors = require("cors");
const http = require("http");
const initialize = require("./utils/Socket");
const chat = require("./router/chat");
require("dotenv").config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookie());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);
app.use("/", userRouter);
app.use("/", chat);
const server = http.createServer(app);
initialize(server);
connectDb()
  .then(() => {
    console.log("Database Connection established");
    server.listen(process.env.PORT);
    console.log("Server is listening");
  })
  .catch((err) => {
    console.log("connection cannot be established");
  });
