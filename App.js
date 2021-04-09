const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 8000;
//const index = require("./routes/index");

const app = express();
//app.use(index);

app.use(express.static('public'));

const server = http.createServer(app);

const io = socketIo(server, {
    
});



app.get('/', function(request, response) {
    response.send("");
  });


io.on("connection", (socket) => {

    console.log("New client connected");
    socket.emit("NewMessage", {sender: "Bob", message: "Hello this is chat"});
    socket.emit("NewMessage", {sender: "Svend21", message: "Hello chat this is svend"});
    
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    socket.on("addMessage", (data) => {
       socket.broadcast.emit("NewMessage", data);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
