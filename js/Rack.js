let rules = require("../rules.js");

module.exports = (capacity) => {

    let tiles = [];
    let cap = rules.rackSize;

    const getTiles = (indices) => indices.map(i => tiles[i]);

    const list = () => tiles.map(tile => tile);

    const remTiles = (indices) => { indices.forEach(i => {tiles.splice(i)}) }

    const putTiles = (t) => { tiles = tiles.concat(t) }

    const pickTiles = (indices) => {
        let t = getTiles(indices);
        remTiles(indices);
        return t;
    }

    return {
        getTiles: getTiles,
        remTiles: remTiles,
        putTiles: putTiles,
        pickTiles: pickTiles,
        list: list,

        holding: () => tiles.length,
        capacity: () => cap
    }
}
