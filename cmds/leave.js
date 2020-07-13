const theme = require("../theme.js");

module.exports = {
    name: "leave",
    aliases: ["exit", "l", "e"],
    needsGameDefn: true,
    needsGameInit: false,
    execute: (sid, cid, pid, args, msg, games, game) => {
        if (game.hasPlayer(pid)) {
            game.remPlayer(pid);
            msg.channel.send((msg.member.nickname || msg.author.username) + " has left this game");
        } else {
            msg.channel.send("You can't leave what you were never part of");
        }
    }
}
