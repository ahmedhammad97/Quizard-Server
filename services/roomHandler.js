// Schema:
/**
 * players: Object {String(id): String(name)}
 * ownerId: String
 * counter: Number
 * settings: Object {category: String, number: Number, time: Number}
 */
const rooms = {};

exports.addRoom = function(roomCode, roomSettings) {
    rooms[roomCode] = {};
    rooms[roomCode].settings = roomSettings;
    rooms[roomCode].counter = 0;
    rooms[roomCode].questionStatus = new Array(roomSettings.number).fill(false);
    rooms[roomCode].scores = {};
    rooms[roomCode].players = [];
}

exports.checkPossibilityToJoin = function(roomCode) {
    if (!rooms.hasOwnProperty(roomCode)) return {'status': false, 'message': 'Room does not exist'};
    if (rooms[roomCode].counter > 4) return {'status': false, 'message': 'Room Full'};
    return {'status': true};
}

exports.addPlayer = function(playerId, name, roomCode) {
    rooms[roomCode].players.push({playerId: name});
    if (rooms[roomCode].counter === 0) rooms[roomCode].owner = playerId;
    rooms[roomCode].counter++;
}

exports.getRoomCounter = function(roomCode) {
    return rooms[roomCode].counter;
}

exports.roomExists = function(roomCode) {
    return rooms.hasOwnProperty(roomCode)
}

exports.setOwner = function(roomCode, ownerId) {
    rooms[roomCode].owner = ownerId;
}

exports.getGameSettings = function(roomCode) {
    return rooms[roomCode].settings;
}

exports.isFirstAnswer = function(roomCode, questionIndex) {
    if (!rooms[roomCode].questionStatus[questionIndex]) {
        rooms[roomCode].questionStatus[questionIndex] = true
        return true;
    }
    else return false;
}

exports.submitScore = function(playerId, score) {
    rooms[roomCode].scores[playerId] = score;
}

exports.getSubmittedScores = function(roomCode) {
    return rooms[roomCode].scores;
}

exports.getPlayerName = function(roomCode, playerId) {
    return rooms[roomCode].players[playerId];
}