//const logic = require("./gameLogic.js");
const Board = require("./Board.js");
const BagOfTiles = require("./BagOfTiles.js");
const Rack = require("./Rack.js");

let Game = (_server, _chnl) => {

    let server = _server;
    let chnl = _chnl;
    let capacity = 4;
    const w = 5; const h = 5; const rackSize = 7;

    let board = Board(w, h);
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
        bagOfTiles.put(players[i].rack.getAllTiles());
        players.splice(i);
    }

    const start = () => {
        board.init();
        bagOfTiles.init();
        players.forEach((player) => {player.rack.putTiles( bagOfTiles.pick(7) )});
        turn = 0;
        hasStarted = true;
    }

    const place = (startingCell, inputAxis, tileIndices) => {
        let {verified, verifiedCartesianInput, indicesOfTilesToBeRemovedFromRack, errMsg} = board.verifyAccomodation( rack.getTiles(tileIndices), startingCell, inputAxis, tileIndices );
        if (verfified) {
            board.accomodateInput(verifiedCartesianInput);
            let result = board.findResultOfInput(verifiedCartesianInput, inputAxis);
            players[turn].score += result.score;
            players[turn].rack.remTiles(indicesOfTilesToBeRemovedFromRack);
            players[turn].rack.putTiles(bagOfTiles.pick( rack.capacity() - rack.holding() ));
            pass();
            return {code: 0};
        } else {
            return {code: 1, errMsg: errMsg};
        }
    }

    let xchange = (tileIndices) => {
        bagOfTiles.put( players[turn].rack.pickTiles(tileIndices) );
        players[turn].rack.putTiles(bagOfTiles.pick( rack.capacity - rack.holding ));
        pass();
    }

    let challenge = () => {}

    let pass = () => { turn = (turn + 1) % players.length }

    return {
        hasPlayer: hasPlayer,
        addPlayer: addPlayer,
        remPlayer: remPlayer,
        hasMaxPlayers: () => players.length == capacity,
        isLeader: (playerId) => players[0].id == playerId,
        getLeaderId: () => players[0].id,
        hasStarted: () => hasStarted,

        start: start,
        place: place,
        xchange: xchange,
        pass: pass,

        hasTurn: (playerId) => players[turn].id == playerId
    }
}

module.exports = Game;
