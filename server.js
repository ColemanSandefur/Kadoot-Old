//jshint esversion: 6

//Modules
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const path = require("path");
const bodyParser = require("body-parser");
const io = require("socket.io")(http);

//My Files
const DatabaseManager = require("./js_classes/database_manager.js").DatabaseManager;
const SocketManager = require("./js_classes/socket_manager.js").SocketManager;
const GameManager = require("./js_classes/game_manager").GameManager;

//Add Directories
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

//Clear Active Cookies
DatabaseManager.dbQuery("DELETE FROM users");

http.listen(3000, () => {
    console.log("Listening on port *3000");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    let username = req.body.username;
    let game_id = req.body.game_id;

    if (username == null || game_id == null){
        res.sendFile(__dirname + "/index.html");
    }
    
    DatabaseManager.createCookie(32).then((cookie) => {
        res.cookie("user_id", cookie);
        DatabaseManager.addCookie(cookie, username, game_id, false).then(() => {
            GameManager.AddUser(cookie, username, game_id);
            res.sendFile(__dirname + "/game.html");
        });
    });

    console.log("post");
});

app.get("/game-creator", (req, res) => {
    res.sendFile(__dirname + "/game-creator.html");
});

app.post("/game-creator", (req, res) => {
    let question_id = req.body.game_id;
    
    if (question_id == null){
        res.sendFile(__dirname + "/game-creator.html");
        return;
    }

    let game_id = GameManager.createGameId();
    GameManager.CreateGame(game_id, question_id);

    DatabaseManager.createCookie(32).then((cookie) => {
        res.cookie("user_id", cookie);
        DatabaseManager.addCookie(cookie, null, game_id, true).then(() => {
            res.set("game_id", game_id);
            res.sendFile(__dirname + "/admin-game.html");
        });
    });
});

io.on("connection", (socket) => {
    console.log("user connected");
    SocketManager.AddSocket(socket);
});