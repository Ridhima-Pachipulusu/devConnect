const socket = require("socket.io");
const crypto = require("crypto");
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
    socket.on("joinChat", ({firstName, userId, toUserId}) => {
      const roomId = getRoomId(userId, toUserId);
      console.log(firstName + "joined" + roomId);
      socket.join(roomId);
    });
    socket.on("sendMessage", ({firstName,userId, toUserId, newMessage}) => {
      const roomId = getRoomId(userId, toUserId);
     console.log(firstName + " " + newMessage);
      io.to(roomId).emit("messageReceived", { newMessage });
    });
    socket.on("disconnect", () => {
    });
  });
};
module.exports = initialize;
