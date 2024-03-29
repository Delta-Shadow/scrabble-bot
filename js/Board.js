let rules = require("../rules.js");

module.exports = () => {

    const width = rules.boardW; const height = rules.boardH;
    const emptyVal = "";
    let grid = [];
    for (let i = 0; i < height; i++) { grid.push(new Array(width).fill(emptyVal)) }
    let premiums = {
        word: {...rules.premiums.word},
        letter: {...rules.premiums.letter}
    }

    const init = () => { 
        grid.forEach(row => row.fill(emptyVal));
        premiums = {
            word: {...rules.premiums.word},
            letter: {...rules.premiums.letter}
        }
    }

    const verifyAccomodation = (cartesianInput) => {
        //let cartesianInput = getCartesianInput(tiles, startingCell, axis);
        let verified = false;
        let errMsg = "The input is not connected to any pre-existing tiles";
        let verifiedInput = []; let indicesOfInputsRemoved = [];
        //cartesianInput.forEach(input => {
        for (let i = 0; i < cartesianInput.length; i++) {
            let input = cartesianInput[i]; // alias
            if (cellContains(input.x, input.y, emptyVal) == "yes") {
                // cell is empty
                verifiedInput.push( cartesianInput[i] );

                if ((cellContains(input.x+1, input.y, emptyVal) == "no") || (cellContains(input.x-1, input.y, emptyVal) == "no") || (cellContains(input.x, input.y+1, emptyVal) == "no") || (cellContains(input.x, input.y-1, emptyVal) == "no")) {
                    // cell has connected neighbours
                    verified = true;
                } 
            } else {
                // cell not empty
                // dont consider in final input.
                indicesOfInputsRemoved.push(i);

                if (cellContains(input.x, input.y, input.val) == "yes") {
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
            verifiedCartesianInput: (verified ? verifiedInput : null), 
            indicesOfInputsRemoved: (verified ? indicesOfInputsRemoved : null), 
            errMsg: (verified ? null : errMsg)
        }
    }

    const accomodateInput = (cartesianInput) => { cartesianInput.forEach(input => {grid[input.y][input.x] = input.val}) }

    const evaluateAccomodation = (cartesianInputThatCausedUpdate, inputAxis) => {
        let inp = cartesianInputThatCausedUpdate; // alias
        let perpendicularAxis = (inputAxis == "x") ? "y" : "x";
        let words = [];
        // For Parallel
        let w = findWord(inputAxis, inp[0].x, inp[0].y);
        if (w != null) {words.push(w)}
        // For Perpendicular
        inp.forEach(_inp => {
            let w = findWord(perpendicularAxis, _inp.x, _inp.y);
            if (w != null) { words.push( w ) }
        });
        return words;
        /*words = [
            word -> {premium: 1, letters: [
                {
                    val: "a",
                    premium: 1
                },
            ]},
        ]*/
    }

    const findWord = (axis, xPos, yPos) => {
        let hasWordFormed = false;
        let word = { premium: 1, letters: [] };
        let a; let b; let aTerminated = false; let bTerminated = false;
        if (axis == "x") {
            a = xPos; b = xPos;
            while (!aTerminated && !bTerminated) {
                if (cellContains(a+1, yPos, emptyVal) == "no") { a++ } else { aTerminated = true }
                if (cellContains(b-1, yPos, emptyVal) == "no") { b-- } else { bTerminated = true }
            }
            if (a != b) {
                hasWordFormed = true;
                for (let i = a; i >= b; i--) {
                    let key = "t" + ((yPos * width) + i);
                    let letter = {val: grid[yPos][i], premium: 1};
                    console.log("The letter is: " + letter.val)
                    if (premiums.letter.hasOwnProperty(key)) {letter.premium *= premiums.letter[key]; delete premiums.letter[key]};
                    if (premiums.word.hasOwnProperty(key)) {word.premium *= premiums.word[key]; delete premiums.word[key]};
                    word.letters.push(letter);
                }
            }
        } else if (axis == "y") {
            a = yPos; b = yPos;
            while (!aTerminated && !bTerminated) {
                if (cellContains(xPos, a+1, emptyVal) == "no") { a++ } else { aTerminated = true }
                if (cellContains(xPos, b-1, emptyVal) == "no") { b-- } else { bTerminated = true }
            }
            if (a != b) {
                hasWordFormed = true;
                for (let i = a; i >= b; i--) {
                    let key = "t" + ((i * width) + xPos);
                    let letter = {val: grid[i][xPos], premium: 1};
                    if (premiums.letter.hasOwnProperty(key)) {letter.premium *= premiums.letter[key]; delete premiums.letter[key]};
                    if (premiums.word.hasOwnProperty(key)) {word.premium *= premiums.word[key]; delete premiums.word[key]};
                    word.letters.push(letter);
                }
            }
        }
        return hasWordFormed ? word : null;
    }

    const getCartesianInput = (tiles, startingCell, axis) => {
        let i = 0; let valid = true;
        let inp = tiles.map(tile => {
            let key = startingCell - ((axis == "x") ? 1 : width) * i;
            i++;
            if (key < 0 || key >= width*height) {valid = false}
            return {
                x: key % width,
                y: Math.floor(key / width),
                val: tile
            }
        });
        return ((valid) ? inp : null)
    };

    const cellContains = (x, y, val) => { try {return (grid[y][x] == val ? "yes" : "no")} catch {return "outOfBounds"} }

    return {
        init: init,
        getCartesianInput: getCartesianInput,
        verifyAccomodation: verifyAccomodation,
        accomodateInput: accomodateInput,
        evaluateAccomodation: evaluateAccomodation,
        getGrid: () => grid.map(row => row.map(cell => cell)),
        totalSquares: () => width * height,
        getCentreCoords: () => Math.floor((width*height) / 2)
    }
}
