//jshint esversion: 6

const io = require("socket.io");
const DatabaseManager = require("./database_manager.js").DatabaseManager;
const Questions = require("./questions.js").Questions;

/*
user_data: {
    name: "",
    score: 0
}
*/
class Game{
    constructor(game_id, question_id){
        this.game_id = game_id;
        this.questions = Questions.getGame(question_id).questions;
        this.user_sockets = {};
        this.user_data = {};
    }

    SetHost(socket){
        this.host = socket;
        console.log("Set Host");

        socket.emit("give-game-id", this.game_id);
    }

    AddUser(cookie, name){
        this.user_data[cookie] = {"name": name, "score": 0};

        this.host.emit("user-connected", name);
    }

    ReconnectUser(socket){
        let cookie = socket.handshake.headers.cookie;

        this.user_sockets[cookie] = socket;

        console.log("reconnected user");
    }
}

class GameManager{
    static CreateGame(game_id, question_id){
        GameManager.games[game_id] = new Game(game_id, question_id);
    }

    static AddUser(cookie, username, game_id){
        console.log(`cookie: ${cookie}, username: ${username}, game_id: ${game_id}`);
        console.log(Object.keys(GameManager.games));
        GameManager.games[game_id].AddUser(cookie, username);
    }

    static ReconnectUser(socket){
        let user_id = getUserId(socket.handshake.headers.cookie);

        if (user_id.length == 0){
            return;
        }

        DatabaseManager.getCookieData(user_id).then((dat) => {
            if (dat.length == 0){
                return;
            }

            dat = dat[0];

            let game_id = dat.game_id;
            let name = dat.username;
            let leader = dat.leader;

            if (leader){
                GameManager.games[game_id].SetHost(socket);
            } else {
                GameManager.games[game_id].ReconnectUser(socket);
            }
        });
    }

    static createGameId(){
        let output = "";
        for (let i = 0; i < 8; i++){
            output += Math.floor(Math.random() * 10);
        }
        return parseInt(output);
    }
}

function getUserId(cookie){
    cookie += ";";
    let userIndex = cookie.indexOf("user_id=");
    return cookie.substring(userIndex + "user_id=".length, cookie.indexOf(";", userIndex));
}

GameManager.games = {};

module.exports.Game = Game;
module.exports.GameManager = GameManager;