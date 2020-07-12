const {createCanvas} = require("canvas");
const theme = require("../theme.js");

const w = theme.board.w; const h = theme.board.h;

const draw = (ctx, grid) => {
    const rows = grid.length; const cols = grid[0].length;
    const cellW = h/rows; const cellH = w/cols;

    ctx.fillStyle = theme.board.color;
    ctx.strokeStyle = theme.board.lineColor;
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 3;

    ctx.beginPath();
    for (let i = 1; i < rows; i++) {
        ctx.moveTo(0, cellH*i);
        ctx.lineTo(w, cellH*i);
    }
    for (let i = 1; i < cols; i++) {
        ctx.moveTo(cellW*i, 0);
        ctx.lineTo(cellW*i, h);
    }
    ctx.closePath();
    ctx.stroke();
}

module.exports = (grid) => {
    let canvas = createCanvas(w, h);
    let ctx = canvas.getContext("2d");
    draw(ctx, grid);

    //return new discord.MessageAttachment( canvas.createPNGStream() ).setName(imgName + ".png");
    return canvas.createPNGStream();
}
