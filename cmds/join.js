let theme = require("../theme.js");

module.exports = {
    name: "join",
    aliases: ["j"],
    needsGameDefn: true,
    needsGameInit: false,
    execute: (sid, cid, pid, args, msg, games, game) => {
        msg.channel.startTyping();

        if (!game.hasStarted()) {
            if (!game.hasPlayer(pid)) {
                if (!game.hasMaxPlayers()) {
                    game.addPlayer(pid);
                    msg.channel.send("A new player has joined the game. Welcome " + (msg.member.nickname || msg.author.username));
                } else {
                    msg.channel.send("No more space in this game for new players");
                }
            } else {
                msg.channel.send("You have already joined the game");
            }
        } else {
            msg.channel.send("A game is already in progress here! Wait till its over to join");
        }

        msg.channel.stopTyping();
    }
}
