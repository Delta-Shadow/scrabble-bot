const fs = require("fs");
const discord = require("discord.js");

let games = require("./js/Games.js")();
const {token} = require("./config.js");
let prefix = "!";

const client = new discord.Client();
client.commands = new discord.Collection();

let cmdDir = "cmds";
fs.readdirSync(cmdDir).filter(file => file.endsWith(".js")).forEach(cmdFile => {
    let cmdData = require("./" + cmdDir + "/" + cmdFile);
    client.commands.set(cmdData.name, cmdData);
}); 

client.once("ready", () => {
    console.log("Ready");
});

client.on("message", msg => {
    if (!msg.author.bot && msg.content.startsWith(prefix)) {
        let msgAuthorId = msg.author.id
        let msgChannelId = msg.channel.id;
        let msgServerId = msg.channel.guild.id;

        let args = msg.content.slice(1, msg.length).toLowerCase().split(" ");
        let cmdName = args.shift();

        let cmd = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));
        if (!cmd) {
            msg.channel.send("Command not found. Refer to the help page to find what you need.");
            return;
        };

        if (games.hasGame(msgServerId, msgChannelId)) {
            let game = games.getGame(msgServerId, msgChannelId);
            cmd.execute(msgServerId, msgChannelId, msgAuthorId, args, msg, games, game);
        } else {
            if (cmd.needsGameDefn) {
                msg.channel.send("No games running in this channel. Create one!"); 
                return;
            } else {
                cmd.execute(msgServerId, msgChannelId, msgAuthorId, args, msg, games, false);
            }
        }
        //msg.channel.send({files: [getImg("board")], embed: embed});
    }
});

client.login(token);

