const express = require("express");
const app = express();
app.use("/test", (req, res) => {
  res.send("Server is running");
});
app.use("/hello", (req, res) => {
  res.send("Server is running hello");
});
app.listen(7777);
