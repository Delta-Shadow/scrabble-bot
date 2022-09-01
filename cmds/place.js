const theme = require("../theme.js");

module.exports = {
    name: "place",
    aliases: ["put", "lay", "p", "l"],
    needsGameDefn: true,
    needsGameInit: true,
    execute: (sid, cid, pid, args, msg, games, game) => {
        // Format for input- !place tile_number_a_or_d word
        // word and location marker can switch places without consequence 

        if (!game.hasTurn(pid)) { msg.channel.send("It is not your turn to play"); return; }

        let locationMarker = null; let word = null;
        let firstCell; let axis; let chars;

        for (let i = 0; i < Math.min(2, args.length); i++){
            let isLocationMarker = false;
            for (let j in args[i]) {
                let char = args[i][j].charCodeAt();
                if (char >= 48 && char <= 57) { // is the char a number?
                    isLocationMarker = true; 
                    locationMarker = args[i]; 
                    break; 
                }
            }
            if (!isLocationMarker) {word = args[i]};
        }

        if (word == null) { msg.channel.send("Specify a valid word that you want to place"); return; }
        chars = Array.from(word);

        if (game.isItTheFirstMove()) {
            axis = "x";
            firstCell = game.getBoardCentre() + Math.floor(chars.length/2);
        } else {
            if (locationMarker == null) { msg.channel.send("Specify where you want to place that word"); return; }
            axis = locationMarker.slice(locationMarker.length - 1); 
            firstCell = locationMarker.slice(0, locationMarker.length - 1);
            if (!(axis == "a" || axis == "d")) {
                axis = null;
                msg.channel.send("Specify either across(a) or down(d) as a direction"); 
                return;
            } else {
                if (axis == "a") { axis = "x" } else if (axis == "d") { axis = "y" }
                let a = firstCell.length;
                firstCell = parseInt(firstCell) - 1;
                if (a != (""+firstCell).length) { msg.channel.send("I can't understand the location you have specified"); return; }
            }
        }

        //console.log(firstCell, axis, chars);
        let result = game.place(firstCell, axis, chars);
        if (result.err == null) {
            msg.channel.send("Your move was placed");
        } else { // something was wrong in the input
            msg.channel.send("There was an issue with your Input. " + result.err);
        }

    }
}
