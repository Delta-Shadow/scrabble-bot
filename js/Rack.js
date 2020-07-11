module.exports = (capacity) => {

    let tiles = [];
    let cap = capacity;

    const getTiles = (indices) => indices.map(i => tiles[i]);

    const getAllTiles = () => tiles;

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
        getAllTiles: getAllTiles,

        holding: () => tiles.length,
        capacity: () => cap
    }
}
