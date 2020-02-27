//jshint esversion: 8

const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kadoot_data"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database");
});

class DatabaseManager{
    static addCookie(cookie, username, game_id, host){
        return new Promise((res, rej) => {
            this.dbQuery("INSERT INTO users (cookie, username, game_id, leader) VALUES (?, ?, ?, ?)", [cookie, username, game_id, host]).then((dat) => {
                res();
            });
        });
    }

    static getCookieData(cookie){
        return new Promise((res, rej) => {
            this.dbQuery("SELECT * FROM users WHERE cookie=?",[cookie]).then((dat) => {
                res(dat);
            });
        });
    }

    static createCookie(len){
        return new Promise((res, rej) => {
            createCookie(len).then((cookie) => {
                res(cookie);
            });
        });
    }

    static dbQuery(query, data) {
        return new Promise(function (res, rej) {
            DatabaseManager.con.query(query, data, function (err, result) {
                if (err) rej(err);
                else res(result);
            });
        });
    }
}

DatabaseManager.con = con;

async function createCookie(len){
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let cookie = "";
    let running = true;
    while (running){
        for (let i = 0; i < len; i++){
            cookie += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        await DatabaseManager.getCookieData(cookie).then((dat) => {
            if (dat.length == 0){
                running = false;
            }
        });

        
    }
    return cookie;
}

module.exports.DatabaseManager = DatabaseManager;