let theme = require("../theme.js");

module.exports = {
    name: "create",
    aliases: ["new", "host", "c", "n"],
    needsGameDefn: false,
    needsGameInit: false,
    execute: (sid, cid, pid, args, msg, games, game) => {
        msg.channel.startTyping();

        if (!game) {
            games.addGame(sid, cid);
            games.getGame(sid, cid).addPlayer(pid);
            msg.channel.send("A Game has been set up. Call your friends to join and start the game!");
        } else {
            msg.channel.send("A Game has already been created in this channel. You may join it or create another one elsewhere.");
        }

        msg.channel.stopTyping(true);
    }
}
