const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: String },
},{timestamps:true});
const chatSchema = new mongoose.Schema({
  participants:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  }],
  messages: [messageSchema],
});
const Chat = new mongoose.model("chat", chatSchema);
module.exports = { Chat };
