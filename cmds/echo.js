module.exports = {
    name: "echo",
    aliases: ["t"],
    needsGameDefn: false,
    needsGameInit: false,
    execute: (sid, cid, pid, args, msg, games, game) => {
        args.forEach(arg => { 
            for (let char in arg) {
                msg.channel.send(arg[char])
            }
         })
    }
}
