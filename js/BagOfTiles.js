module.exports = () => {

    const TILE_FREQUENCY = {
        d: 3, y: 7
    }
    
    let tiles = {...TILE_FREQUENCY};

    const init = () => {
        tiles = {...TILE_FREQUENCY};
    }

    const pick = (n) => {
        let pickedTiles = [];
        while (n > 0) {
            let sum = Object.values(tiles).reduce((val, res) => res + val);
            let rand = Math.random();
            for (let i in tiles) {
                if (rand <= tiles[i]/sum && rand != 0) {
                    pickedTiles.push(i);
                    tiles[i]--;
                    break;
                }
            }
            n--;
        }
        return pickedTiles;
    }

    const put = (arrOfTiles) => {
        arrOfTiles.forEach(tile => {tiles[tile]++});
    }

    const amount = () => Object.values(tiles).reduce((val, res) => res + val);

    return {
        pick: pick,
        put: put,
        amount: amount,
        init: init
    }
}
