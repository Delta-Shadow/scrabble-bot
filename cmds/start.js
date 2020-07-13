const theme = require("../theme.js");

module.exports = {
    name: "start",
    aliases: ["begin", "s"],
    needsGameDefn: true,
    needsGameInit: false,
    execute: (sid, cid, pid, args, msg, games, game) => {
        msg.channel.startTyping();

        let leader = msg.channel.members.get(game.getLeaderId());
        let leaderName = (leader.nickname || leader.user.username);

        if (!game.hasMinPlayers()) {
            if (game.isLeader(pid)) {
                game.start();
                msg.channel.send({embed: {
                    color: theme.embedColor,
                    title: "Let the Scrabbling begin!"
                }});
            } else {
                msg.channel.send("Only the creator (" + leaderName + ") can start this game");
            }
        } else {
            msg.channel.send("You need atleast two players to start");
        }

        msg.channel.stopTyping();
    }
}
