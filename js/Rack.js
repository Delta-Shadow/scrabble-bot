let rules = require("../rules.js");

module.exports = () => {

    let tiles = [];
    let cap = rules.rackSize;

    const getTiles = (indices) => indices.map(i => tiles[i]);

    const list = () => tiles.map(tile => tile);

    const remTiles = (indices) => { 
        let newTiles = [];
        for (let i = 0; i < tiles.length; i++) { if (!indices.includes(i)) newTiles.push(tiles[i]) }
        tiles = newTiles;
    }

    const putTiles = (t) => { tiles = tiles.concat(t) }

    const pickTiles = (indices) => {
        let t = getTiles(indices);
        remTiles(indices);
        return t;
    }

    const scanTiles = (chars) => {
        let okay = true; let indices = []; let _tilez = [...tiles];
        for (let i in chars) {
            let index = _tilez.indexOf(chars[i]);
            if (index == -1) {
                okay = false; break;
            } else {
                delete _tilez[index]; indices.push(index);
            }
        };
        return {okay: okay, indices: ((okay) ? indices : null)};
    }

    return {
        getTiles: getTiles,
        remTiles: remTiles,
        putTiles: putTiles,
        pickTiles: pickTiles,
        scanTiles: scanTiles,
        list: list,

        holding: () => tiles.length,
        capacity: () => cap
    }
}
