module.exports = (w, h) => {

    const width = w; const height = h;
    let grid = new Array(h).fill( new Array(w).fill(" ") );

    const init = () => { grid.forEach(row => row.fill(" ")) }

    const verifyAccomodation = (tiles, startingCell, axis, tileIndices) => {
        let cartesianInput = getCartesianInput(tiles, startingCell, axis);
        let verified = false;
        let errMsg = "The input is not connected to any pre-existing tiles";
        let verifiedInput = []; let discardedTiles = [];
        //cartesianInput.forEach(input => {
        for (let i = 0; i < cartesianInput.length; i++) {
            let input = cartesianInput[i];
            if (cellContains(input.x, input.y, " ")) {
                // cell is empty
                verifiedInput.push( cartesianInput[i] );

                if (!cellContains(input.x+1, input.y, " ") ||
                    !cellContains(input.x-1, input.y, " ") ||
                    !cellContains(input.x, input.y+1, " ") ||
                    !cellContains(input.x, input.y-1, " ") ) {
                    // cell has connected neighbours
                    verified = true;
                } 
            } else {
                // cell not empty
                // dont consider in final input.
                discardedTiles.push( tileIndices[i] );

                if (cellContains(input.x, input.y, input.val)) {
                    // repeated tile
                    verified = true;
                } else {
                    // conflicted tile
                    verified = false;
                    errMsg = "A tile is in conflict";
                    break;
                }
            }
        };
        return {
            verified: verified, 
            verifiedCartesianInput: (verified ? verifiedInput : null), 
            indicesOfTilesToBeRemovedFromRack: (verified ? discardedTiles : null), 
            errMsg: (verified ? null : errMsg)
        }
    }

    const accomodateInput = (cartesianInput) => { cartesianInput.forEach(input => { grid[input.y][input.x] = input.val }) }

    const findResultOfInput = (cartesianInput, axis) => {
        let result = {
            // score, words: [ {word, ptns}, ... ]
            words: findCreatedWords(cartesianInput, axis)
        }
        let sum = 0; words.forEach(word => {sum += word.ptns});
        result.score = sum;
        return result;
    }

    const findCreatedWords = (cartesianInputThatCausedUpdate, inputAxis) => {
        let inp = cartesianInputThatCausedUpdate; // alias
        let perpendicularAxis = (inputAxis == "x") ? "y" : "x";
        let words = [];
        words.push(findWord(inputAxis, inp[0].x, inp[0].y)); // find parallel word
        inp.forEach((_inp) => { // find perpendicular word(s)
            let word = findWord(perpendicularAxis, _inp.x, _inp.y);
            if (word.length > 1) { words.push( {word: word, ptns: 0} ) }
        });
        return words;
    }

    const findWord = (axis, xPos, yPos) => {
        let word = "";
        let a; let b; let aTerminated = false; let bTerminated = false;
        if (axis == "x") {
            a = xPos; b = xPos;
            while (!aTerminated && !bTerminated) {
                if (!cellContains(a+1, yPos, ' ')) { a++ } else { aTerminated = true }
                if (!cellContains(b-1, yPos, ' ')) { b-- } else { bTerminated = true }
            }
            for (let i = a; i >= b; i--) {
                word += grid[yPos][i];
            }
        } else if (axis == "y") {
            a = yPos; b = yPos;
            while (!aTerminated && !bTerminated) {
                if (!cellContains(xPos, a+1, ' ')) { a++ } else { aTerminated = true }
                if (!cellContains(xPos, b-1, ' ')) { b-- } else { bTerminated = true }
            }
            for (let i = a; i >= b; i--) {
                word += grid[i][xPos];
            }
        }
        return word;
    }

    const getCartesianInput = (tiles, startingCell, axis) => {
        let i = 0;
        return tiles.map(tile => {
            let key = startingCell + ((axis == "x") ? 1 : width) * i;
            i++;
            return {
                x: key % width,
                y: Math.floor(key / width),
                val: tile
            }
        });
    };

    const cellContains = (x, y, val) => { try {return (grid[y][x] == val ? true : false)} catch {return false} }

    return {
        init: init,
        verifyAccomodation: verifyAccomodation,
        accomodateInput: accomodateInput,
        findResultOfInput: findResultOfInput
    }
}
