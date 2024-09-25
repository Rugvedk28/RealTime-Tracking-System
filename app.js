const express = require("express");
const app = express();

const path = require("path");
const http = require("http");

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("send-location", function(data) {
        io.emit("recieve-location", {id:socket.id, ...data});
    });    
    socket.on("disconnect", function() {
        io.emit("user-disconnected", socket.id);
        console.log("user disconnected");
    });
    socket.on("error", (err) => {
        console.log("error in socket: ", err);
    });
});

app.get("/", function(req, res) {
    res.render("index");
});

server.listen(3000, () => {
    console.log("server started on port 3000");
});



