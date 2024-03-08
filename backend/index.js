const express = require("express");
const app = express();
const http = require("http");
const { PORT, CLIENT_BASE_URL } = require("./config/server.config");
const socketIO = require("socket.io");

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: CLIENT_BASE_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (details) => {
    const { name, room } = details;
    socket.join(room);

    socket.on("newMessage", (message) => {
      io.to(room).emit("newMessageInTheRoom", { user: name, text: message });
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
