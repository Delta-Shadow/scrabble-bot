let rules = require("../rules.js");

module.exports = () => {

    let tiles = {...rules.tileFrequency};

    const init = () => {
        tiles = {...rules.tileFrequency};
    }

    const pick = (_n) => {
        let total = amount(); let n = (_n > total) ? total : _n;
        let pickedTiles = [];
        while (n > 0) {
            let sum = Object.values(tiles).reduce((val, res) => res + val);
            let residue = 0;
            let rand = Math.random();
            if (rand == 0) {rand = 1}
            for (let i in tiles) {
                if (rand > residue && rand <= residue + tiles[i]/sum) {
                    pickedTiles.push(i);
                    tiles[i]--;
                    break;
                } else {
                    residue += tiles[i]/sum;
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
