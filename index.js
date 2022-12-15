const express = require("express");
const { Server } = require("socket.io");
const http = require('http');
const cors = require("cors");

const app = express();
app.use(cors())

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get("/", (req, res) => {
  res.send("Chat server running by Saksham");
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("joinRoom",room => socket.join(room))
  socket.on("joinUser",name =>{
    console.log(name);
    socket.broadcast.emit('userJoined',{user:name,message:' has joined Chat'})

    socket.on('disconnect',()=>{
      socket.broadcast.emit('leave',{user:name,message:' has left Chat'})
      console.log('user left');
    })
  })
  


  socket.on("newMessage", ({ newMsg, room }) => {
    console.log(room,newMsg);
    io.in(room).emit("getLatestMessage", newMsg);

  });
});

const port = process.env.PORT || 3500;

server.listen(port, console.log(`Server running at port ${port}`));
