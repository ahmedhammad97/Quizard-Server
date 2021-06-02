const socket = require('socket.io');
const utils = require(__dirname + '/utils');
const roomHandler = require(__dirname + '/roomHandler');
const questionHandler = require(__dirname + '/questionHandler');

exports.socketConnection = function(server){

  //Socket.io main function
  const io = socket(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', socket => {
    console.log(`Socket ${socket.id} joined`);
    socket.emit('initialConnection');

    socket.on('initialConnectionResponse', (data) => {
        socket.join(data.roomCode);
        roomHandler.addPlayer(socket.id, data.name, data.roomCode);
        let playerCounter = roomHandler.getRoomCounter(data.roomCode);
        io.sockets.to(data.roomCode).emit('playerCounter', playerCounter);
    });


    socket.on('startGame', data => {
        let playerCounter = roomHandler.getRoomCounter(data.roomCode);
        if (playerCounter > 4 || playerCounter < 1) {
            socket.emit('gameStartFailed');
        }
        else {
            // Generate Questions
            let gameSettings = roomHandler.getGameSettings(data.roomCode);
            let questions = questionHandler.generateQuestions(gameSettings);
            io.sockets.to(data.roomCode).emit('questions', questions);
        }
    });

    socket.on('correctAnswer', data => {
        // Check if first
        if (roomHandler.isFirstAnswer(data.roomCode, data.questionIndex))
            socket.emit('pointConfirmed');
        else socket.emit('pointDenied');
    });

    socket.on('finalScore', data => {
        roomHandler.submitScore(socket.id, data.score);
        let playerCounter = roomHandler.getRoomCounter(data.roomCode);
        let submittedScores = roomHandler.getSubmittedScores(data.roomCode).size();
        if (playerCounter === submittedScores) {
            let winner = utils.calculateWinner(submittedScores);
            let winnerName = roomHandler.getPlayerName(data.roomCode, winner);
            io.sockets.to(data.roomCode).emit('winner', winnerName);
            roomHandler.setOwner(data.roomCode, winner);
        }
    });

    socket.on('disconnect', data => {
        roomHandler.removePlayer(socket.id, data.roomCode);
    });
  });
};
