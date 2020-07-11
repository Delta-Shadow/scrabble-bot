let theme = require("../theme.js");

const getAdiosEmbed = (scoreboard) => {
    return {
        color: theme.embedColor,
        title: "The game has ended!",
        description: "Here are the final standings",
    }
}

module.exports = {
    name: "destroy",
    aliases: ["unhost", "end", "d", "x"],
    needsGameDefn: true,
    execute: (sid, cid, pid, args, msg, games, game) => {
        msg.channel.startTyping();

        if (game.isLeader(pid)) {
            let scoreboard; /* game.getScoreboard(); */
            msg.channel.send({embed: getAdiosEmbed(scoreboard)});
            games.remGame(sid, cid);
        } else {
            let leader = msg.channel.members.get(game.getLeaderId());
            msg.channel.send("Only the creator (" + (leader.nickname || leader.user.username) + ") can stop this game");
        }

        msg.channel.stopTyping();
    }
}
