let theme = require("../theme.js");

const helpEmbed = {
    color: theme.embedColor,
    title: "This is a the Help Page",
    description: "My creator was too lazy to finish this"
}

module.exports = {
    name: "help",
    needsGameDefn: false,
    aliases: ["h"],

    execute: (sid, cid, pid, args, msg, games, game) => {
        msg.channel.startTyping();
        msg.channel.send({embed: helpEmbed});
        msg.channel.stopTyping();
    }
}
