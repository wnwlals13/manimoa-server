require("dotenv").config();
const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["*"],
  },
});

const port = process.env.PORT || 3306;

// socket이 연결되었을 때
io.on("connection", (socket) => {
  console.log("소켓 연결");

  // n번 채팅방 입장
  const roomIndex = socket.handshake.query.chatRoomId;
  socket.on("joinRoom", (roomId, userId) => {
    socket.userId = userId;
    socket.join(roomId);
    socket.room = roomId;
    socket.to(roomId).emit("join", roomId + "chatRoom join");
    console.log(`${userId}님이 ${roomIndex} 번 방에 입장했습니다.`);
  });

  socket.on("chatting", (data) => {
    io.in(data.roomId).emit("send message", data); // roomIndex 방에 채팅 emit = 방출
    console.log(`${roomIndex} 번 방에 사용자가 메세지를 전송했습니다.`);
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("소켓 연결 해제", socket.rooms);
  });
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
