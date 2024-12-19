const mongoose = require("mongoose");
const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://ridhimapachipulusu27:QGonOIGJ9TqAYxXt@node-mongo.bgkzg.mongodb.net/devConnectUsers"
  );
};
module.exports = { connectDb };
