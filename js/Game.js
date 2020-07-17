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
    let turn = 0;
    
    const hasPlayer = (_id) => ((players.findIndex(player => player.id == _id) == -1) ? false : true);

    const addPlayer = (_id) => { players.push({id: _id, rack: Rack(rackSize), ptns: 0}) }

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
        hasStarted = true;
    }

    const place = (_startingCell, inputAxis, _tileIndices) => {
        // basic input checking
        let _err = null;
        let startingCell = _startingCell - 1;
        if (startingCell > board.totalSquares) {_err = "No such square exists. Come on."}
        let tileIndices = _tileIndices.map(i => {
            if (i - 1 > rack.capacity()) {_err = "You dont have a letter at the place " + i}
            return i - 1;
        );
        if (_err != null) return {err: _err}
        // input verification 
        let {verified, verifiedCartesianInput, indicesOfTilesToBeRemovedFromRack, errMsg} = board.verifyAccomodation( rack.getTiles(tileIndices), startingCell, inputAxis, tileIndices );
        if (verfified) {
            board.accomodateInput(verifiedCartesianInput);
            let words = board.evaluateInput(verifiedCartesianInput, inputAxis);
            let score = 0;
            words.forEach(word => {
                let ptns = 0;
                word.letters.forEach(letter => {ptns += rules.tileScore(letter.val) * letter.premium});
                ptns *= word.premium; score += ptns;
            })
            players[turn].score += score;
            players[turn].rack.remTiles(indicesOfTilesToBeRemovedFromRack);
            players[turn].rack.putTiles(bagOfTiles.pick( rack.capacity() - rack.holding() ));
            pass();
            return {err: null};
        } else {
            return {err: errMsg};
        }
    }

    let xchange = (_tileIndices) => {
        let tileIndices = _tileIndices.map(i => i - 1);
        bagOfTiles.put( players[turn].rack.pickTiles(tileIndices) );
        players[turn].rack.putTiles(bagOfTiles.pick( rack.capacity() - rack.holding() ));
        pass();
    }

    let challenge = () => {}

    let pass = () => { turn = (turn + 1) % players.length }

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

        getBoardGrid: () => board.getGrid(),
        getRack: (pid) => players.find(p => p.id == pid).rack.list(),

        hasTurn: (playerId) => players[turn].id == playerId
    }
}

module.exports = Game;
