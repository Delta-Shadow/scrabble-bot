let Game = require("./Game.js");

module.exports = () => {

    let index = {
        /*
        "s_serverId": {
            "c_channelId": Game Instance
        }
        */
    }

    const hasGame = (s_id, c_id) => {
        try {
            if ((typeof index["s" + s_id]) != "undefined") {
                return ( ((typeof index["s" + s_id]["c" + c_id]) != "undefined") ? true : false );
            } else {
                return false;
            }
        } catch {
            return false;
        }
    }

    const getGame = (s_id, c_id) => index["s" + s_id]["c" + c_id];
    
    const addGame = (s_id, c_id) => {
        if ((typeof index["s" + s_id]) == "undefined") {
            index["s" + s_id] = {};
        }
        index["s" + s_id]["c" + c_id] = Game(s_id, c_id);
    }

    const remGame = (s_id, c_id) => { delete index["s" + s_id]["c" + c_id] }

    return {
        hasGame: hasGame,
        getGame: getGame,
        addGame: addGame,
        remGame: remGame
    }
}
