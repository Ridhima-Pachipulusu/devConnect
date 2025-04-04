const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const initialize = (server) => {
  const getRoomId = (userId, toUserId) => {
    return crypto
      .createHash("sha256")
      .update([userId, toUserId].sort().join("$"))
      .digest("hex");
  };
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, toUserId }) => {
      const roomId = getRoomId(userId, toUserId);
      console.log(firstName + "joined" + roomId);
      socket.join(roomId);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, userId, toUserId, newMessage }) => {
        const roomId = getRoomId(userId, toUserId);
        try {
          let chat = await Chat.findOne({
            participants: { $all: [userId, toUserId] },
          });
          if (!chat) {
            chat = await new Chat({
              participants: [userId, toUserId],
              messages: [],
            });
          }
          chat.messages.push({ senderId: userId, message: newMessage });
          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, newMessage });
        } catch (err) {}
      }
    );
    socket.on("disconnect", () => {});
  });
};
module.exports = initialize;
