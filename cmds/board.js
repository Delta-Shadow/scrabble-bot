const theme = require("../theme.js");
const boardImg = require("../embeds/boardImg.js");

const embedData = {
    color: theme.embedColor,
    title: "Here is the current board",
    image: {
        url: "attachment://board.png"
    }
}

module.exports = {
    name: "board",
    needsGameDefn: true,
    needsGameInit: true,
    execute: (sid, cid, pid, args, msg, games, game) => {
        msg.channel.startTyping();
        msg.channel.send({
            files: [{
                attachment: boardImg(game.getBoardGrid()),
                name: "board.png"
            }]
        });
        msg.channel.stopTyping();
    }
}
