const theme = require("../theme.js");

module.exports = {
    name: "start",
    aliases: ["begin", "s"],
    needsGameDefn: true,
    execute: (sid, cid, pid, args, msg, games, game) => {
        msg.channel.startTyping();

        let leader = msg.channel.members.get(game.getLeaderId());
        let leaderName = (leader.nickname || leader.user.username);

        if (game.isLeader(pid)) {
            /*
             * game.start();
            */
            msg.channel.send({embed: {
                title: "Let the Scrabbling begin!",
            }});
        } else {
            msg.channel.send("Only the creator (" + leaderName + ") can start this game");
        }

        msg.channel.stopTyping();
    }
}
