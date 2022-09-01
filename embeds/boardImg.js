const {createCanvas} = require("canvas");
const theme = require("../theme.js");

const w = theme.board.w; const h = theme.board.h;

const draw = (ctx, grid) => {
    const rows = grid.length; const cols = grid[0].length;
    const cellW = w/cols; const cellH = h/rows; 

    // Basic Settings
    ctx.fillStyle = theme.board.color;
    ctx.strokeStyle = theme.board.lineColor;
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 1;

    // Draw Grid Lines
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

    // Filling in the Grids
    let i = 1;
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            let cellVal = grid[y][x];
            let posX = x*cellW; let posY = y*cellH;

            // Filling tiles
            if (cellVal != "") {
                // Drawing Tile
                ctx.fillStyle = theme.tile.color;
                ctx.fillRect(posX, posY, cellW, cellH);
                ctx.fillStyle = theme.tile.textColor;
                // Drawing Tile Text
                ctx.save();
                ctx.textBaseline = "middle"; ctx.textAlign = "center";
                ctx.font = (cellW*(75/100)) + "px " + theme.tile.fontFamily;
                ctx.fillText(cellVal, posX + (cellW/2), posY + (cellH/2));
                ctx.restore();
            }

            // Filling Grid Number
            ctx.fillStyle = theme.board.lineColor;
            ctx.textBaseline = "top";
            ctx.font = (cellW/4) + "px " + theme.board.fontFamily;
            ctx.fillText(""+i, 3+posX, posY, cellW);

            i++;
        }
    }
}

module.exports = (grid) => {
    let canvas = createCanvas(w, h);
    let ctx = canvas.getContext("2d");
    draw(ctx, grid);

    //return new discord.MessageAttachment( canvas.createPNGStream() ).setName(imgName + ".png");
    return canvas.createPNGStream();
}
