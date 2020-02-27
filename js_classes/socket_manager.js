//jshint esversion: 6

const GameManager = require("./game_manager.js").GameManager;
const Questions = require("./questions.js").Questions;

class SocketManager {
    static AddSocket(socket){

        GameManager.ReconnectUser(socket);

        //When a socket wants to search for games it emits "search-games"
        //Gets what the user is searching for and returns it through a callback
        socket.on("search-games", (input, callback) => {
            Questions.searchGames(input).then((dat) => {
                let arr = [];

                for (let i = 0; i < dat.length; i++){
                    arr.push([dat[i].game_name, dat[i].id]);
                }

                callback(arr);
            });
        });
    }   
}

module.exports.SocketManager = SocketManager;