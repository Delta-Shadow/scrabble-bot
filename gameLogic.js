function initBoard(board, w, h) {
    for (let y = 0; y < h; y++) {
        board.push([]);
        for (let x = 0; x < w; x++) {
            board[y].push(" ");
        }
    }
}

function initTiles(tiles) { tiles = Object.assign(TILES) }

function initPlayer(player, tiles) {
    
}

function sortInput(flatInput) {
    return new Promise((resolve, reject) => {resolve( Object.keys(flatInput).sort((a, b) => a-b).map((key) => parseInt(key)) )});
}

function isContinous(sortedKeys, width) {
    let sum = sortedKeys.reduce((res, val) => res + val);
    let d = ( ((sum*2)/sortedKeys.length) - 2*sortedKeys[0] ) / (sortedKeys.length-1);
    let axis = "o";
    if (d == 1) {axis = "x"} else if (d == width) {axis = "y"};
    return new Promise((resolve, reject) => { if (axis == "o") { reject("The given input is not continous") } else { resolve(sortedKeys, direction) } });
}

function getCartesianInput(sortedContinousKeys, flatInput, width) {
    let cartesianInput = sortedContinousKeys.map((key) => (
        {
            x: key % width,
            y: Math.floor(key / width),
            val: flatInput["" + key]
        }
    ));
    return new Promise((resolve, reject) => {resolve(cartesianInput)});
}

function verifyAccomodation(cartesianInput, board) {
    let verified = false;
    let errMsg = "The input is not connected to any pre-existing tiles";
    let verifiedInput = [];
    cartesianInput.forEach((input) => {
        if (cellContains(board, input.x, input.y, " ")) {
            // cell is empty
            verifiedInput.push(input);
            if (!cellContains(board, input.x+1, input.y, " ") ||
                !cellContains(board, input.x-1, input.y, " ") ||
                !cellContains(board, input.x, input.y+1, " ") ||
                !cellContains(board, input.x, input.y-1, " ") ) {
                // cell has connected neighbours
                verified = true;
            } 
        } else {
            // cell not empty
            // dont consider in final input.
            if (cellContains(board, input.x, input.y, input.val) {
                // repeated tile
                verified = true;
            } else {
                // conflicted tile
                verified = false;
                errMsg = "A tile is in conflict";
                break;
            }
        }
    });
    return new Promise((resolve, reject) => { if (verified) {resolve(verifiedInput)} else {reject(errMsg)} });
}

function accomodateInput(verifiedCartesianInput, board) { // Mutates parameter board
    grid.forEach((input) => { board[input.y][input.x] = input.val });
    return new Promise((resolve, reject) => {resolve()});
}

function findCreatedWords(updatedBoard, width, height, cartesianInputThatCausedUpdate, inputAxis) {
    let inp = cartesianInputThatCausedUpdate; // alias
    let perpendicularAxis = (inputAxis == "x") ? "y" : "x";
    let words = [];
    // find parallel word
    words.push(findWord(inputAxis, inp[0].x, inp[0].y, updatedBoard));
    // find perpendicular word(s)
    inp.forEach((_inp) => {
        let word = findWord(perpendicularAxis, _inp.x, _inp.y, updatedBoard);
        if (word.length > 1) { words.push(word) }
    });
    return new Promise((resolve, reject) => {resolve(words)});
}

function findWord(axis, xPos, yPos, board) {
    let word = "";
    let a; let b; let aTerminated = false; let bTerminated = false;
    if (axis == "x") {
        a = xPos; b = xPos;
        while (!aTerminated && !bTerminated) {
            if (!cellContains(board, a+1, yPos, ' ')) { a++ } else { aTerminated = true }
            if (!cellContains(board, b-1, yPos, ' ')) { b-- } else { bTerminated = true }
        }
        for (let i = a; i >= b; i--) {
            word += board[yPos][i];
        }
    } else if (axis == "y") {
        a = yPos; b = yPos;
        while (!aTerminated && !bTerminated) {
            if (!cellContains(board, xPos, a+1, ' ')) { a++ } else { aTerminated = true }
            if (!cellContains(board, xPos, b-1, ' ')) { b-- } else { bTerminated = true }
        }
        for (let i = a; i <= b; i++) {
            word += board[i][xPos];
        }
    }
    return word;
}

function cellContains(board, x, y, val) {
    try { return ((board[y][x] != val ? true : false) } catch {return false}
}
