const router = require('express').Router();
const bodyParser = require('body-parser');
const utils = require(__dirname + '/services/utils');
const roomHandler = require(__dirname + '/services/roomHandler');

var jsonParser = bodyParser.json()

//Home page
router.get('/', (req, res)=>{
  res.send("<h1>Nothing to see here.. It's just a backend server for managing the game</h1>");
});

// Request a new room
router.post('/create', jsonParser, (req, res)=>{
    let code = utils.generateUniqueCode();
    let roomSettings = req.body.settings;
    roomHandler.addRoom(code, roomSettings);
    console.log(`Created room ${code}`);
    res.send({'code': code});
});

//Request access to room by code
router.post('/join', jsonParser, (req, res)=>{
    let code = req.body.roomCode;
    res.send(roomHandler.checkPossibilityToJoin(code));
});

module.exports = router;