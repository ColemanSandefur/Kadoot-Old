//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const http = require("http").createServer(app);
const path = require("path");
const io = require("socket.io");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static(path.join(__dirname, "static")));

http.listen(3000, () => {
    console.log("Listening on port *3000");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.post("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
    console.log("post");
}); 