//const logic = require("./gameLogic.js");
const Board = require("./Board.js");
const BagOfTiles = require("./BagOfTiles.js");
const Rack = require("./Rack.js");
const rules = require("../rules.js");

let Game = (_server, _chnl) => {

    let server = _server;
    let chnl = _chnl;
    let capacity = 4;

    let board = Board();
    let bagOfTiles = BagOfTiles();
    let players = [
        // {id, Rack Instance, ptns}
    ];
    let hasStarted = false;
    let numberOfMoves = 0;
    let turn = 0;
    
    const hasPlayer = (_id) => ((players.findIndex(player => player.id == _id) == -1) ? false : true);

    const addPlayer = (_id) => { players.push({id: _id, rack: Rack(), ptns: 0}) }

    const remPlayer = (_id) => {
        let i = players.findIndex(player => player.id == _id);
        bagOfTiles.put(players[i].rack.list());
        players.splice(i);
    }

    const start = () => {
        board.init();
        bagOfTiles.init();
        players.forEach(player => {player.rack.putTiles( bagOfTiles.pick(7) )});
        turn = 0;
        numberOfMoves = 0;
        hasStarted = true;
    }

    const place = (startingCell, inputAxis, chars) => {
        //let errMsg = null;
        // checking if starting cell is within bounds
            //if (startingCell > board.totalSquares() || startingCell < 0) {errMsg = "No such square exists. Come on."}
        // checking if all tile indices are within bounds
        /*    
            tileIndices.forEach(i => {
                if (i > players[turn].rack.capacity() || i < 0) {errMsg = "You dont have a letter in your rack at the place " + i}
            });
        */
        
        //if (errMsg != null) return {err: errMsg} // Do not proceed if anything raised an error

        // input verification from board
        let verifiedCartesianInput; let indicesOfCharsRemovedFromInput; let errMsgFromBoard;
        let cartesianInput = board.getCartesianInput( chars, startingCell, inputAxis );
        if (cartesianInput == null) {return {err: "Your word is out of Bounds"}}

        if (numberOfMoves == 0) {
            verifiedCartesianInput = cartesianInput;
            indicesOfCharsRemovedFromInput = [];
            errMsgFromBoard = null;
        } else {
            let verificationFromBoard = board.verifyAccomodation( cartesianInput );
            verifiedCartesianInput = verificationFromBoard.verifiedCartesianInput;
            indicesOfCharsRemovedFromInput = verificationFromBoard.indicesOfInputsRemoved;
            errMsgFromBoard = verificationFromBoard.errMsg;
        }

        if (errMsgFromBoard != null) return {err: errMsgFromBoard} // Do not proceed if anything raised an error

        // input verification from rack
        let indicesOfChars = [];
        indicesOfCharsRemovedFromInput.forEach(i => { chars.splice(i) });
        let verificationFromRack = players[turn].rack.scanTiles(chars);
        if (!verificationFromRack.okay) {
            return {err: "You are trying to use letters you dont have in your rack"}
        } else {
            indicesOfChars = verificationFromRack.indices;
        }

        // Finally Do Something
        board.accomodateInput(verifiedCartesianInput);
        let currPlayer = players[turn];
        let words = board.evaluateAccomodation(verifiedCartesianInput, inputAxis);
        /*let score = 0;
        words.forEach(word => {
            let ptns = 0;
            word.letters.forEach(letter => {ptns += rules.tileScore(letter.val) * letter.premium});
            ptns *= word.premium; score += ptns;
        })
        players[turn].score += score;*/
        currPlayer.rack.remTiles(indicesOfChars);
        currPlayer.rack.putTiles(bagOfTiles.pick( currPlayer.rack.capacity() - currPlayer.rack.holding() ));
        pass();
        return {err: null};
    }

    const xchange = (_tileIndices) => {
        let tileIndices = _tileIndices.map(i => i - 1);
        bagOfTiles.put( players[turn].rack.pickTiles(tileIndices) );
        players[turn].rack.putTiles(bagOfTiles.pick( rack.capacity() - rack.holding() ));
        pass();
    }

    const challenge = () => {}

    const pass = () => { numberOfMoves++; turn = (turn + 1) % players.length }

    return {
        hasPlayer: hasPlayer,
        addPlayer: addPlayer,
        remPlayer: remPlayer,
        hasMaxPlayers: () => players.length == capacity,
        hasMinPlayers: () => players.length > 1,
        isLeader: (playerId) => players[0].id == playerId,
        getLeaderId: () => players[0].id,
        hasStarted: () => hasStarted,

        start: start,
        place: place,
        xchange: xchange,
        pass: pass,

        getBoardCentre: () => { return board.getCentreCoords() },
        getBoardGrid: () => board.getGrid(),
        getRack: (pid) => players.find(p => p.id == pid).rack.list(),

        hasTurn: (playerId) => players[turn].id == playerId,
        isItTheFirstMove: () => (numberOfMoves == 0 ? true : false)
    }
}

module.exports = Game;