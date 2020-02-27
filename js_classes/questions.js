//jshint esversion: 6

const DatabaseManager = require("./database_manager.js").DatabaseManager;

class Questions {
    static searchGames(input){
        return new Promise((res, rej) => {
            let search = makeSearch(input);
            let id = search[1];
            let name = search[0];

            DatabaseManager.dbQuery("SELECT * FROM quizes WHERE game_name LIKE ? AND id LIKE ?", [name, id]).then((dat) => {
                res(dat);
            });
        });
    }

    static getGame(id){
        return new Promise((res, rej) => {
            DatabaseManager.dbQuery("SELECT * FROM quizes WHERE id=?", [id]).then((dat) => {
                if (dat.length == 0){
                    res(null);
                    return;
                }

                res(dat[0]);
            });
        });
    }
}

function makeSearch(search){
    var name = "", id = null;

    if (search.indexOf("#") > -1){
        name = "%" + search.substring(0, search.indexOf("#")) + "%";
        var x = search;
        
        const regex = /#([0-9]+)/;
        x = x.match(regex);

        if (x != null)
            id = x[1];
    } else {
        name = search;
    }

    name = "%" + name + "%";

    if (id == null){
        id = "%";
    } else {
        id = "%" + id + "%";
    }
    
    return [name, id];
}

module.exports.Questions = Questions;