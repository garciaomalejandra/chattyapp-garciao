const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//db connection
mongoose
  .connect("mongodb://localhost/chattyapp-db")
  .then((db) => console.log("DB is connected"))
  .catch((err) => console.log(err));

//settings
app.set("port", process.env.PORT || 3000);

require("./sockets.js")(io);

//static files
app.use(express.static(path.join(__dirname, "public")));

//server starting
server.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
