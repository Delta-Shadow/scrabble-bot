const theme = require("../theme.js");

module.exports = {
    name: "rack",
    aliases: ["tiles", "me"],
    needsGameDefn: true,
    needsGameInit: true,
    execute: (sid, cid, pid, args, msg, games, game) => {
        let authorName = (msg.member.nickname || msg.author.username);
        msg.channel.send({embed: {
            color: theme.embedColor,
            title: authorName,
            fields: [{
                name: "These are the tiles in your rack",
                value: game.getRack(pid).join(" ")
            }]
        }});
    }
}
