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
        io.to(data.roomCode).emit('playerCounter', playerCounter);
    });


    socket.on('startGame', data => {
        let playerCounter = roomHandler.getRoomCounter(data.roomCode);
        if (playerCounter > 4 || playerCounter < 2) {
            socket.emit('gameStartFailed');
        }
        else {
            // Generate Questions
            let gameSettings = roomHandler.getGameSettings(data.roomCode);
            let questions = questionHandler.generateQuestions(gameSettings);
            io.to(data.roomCode).emit('questions', {'questions': questions, 'settings': gameSettings});
        }
    });

    socket.on('correctAnswer', data => {
        if (roomHandler.isFirstAnswer(data.roomCode, data.questionIndex))
            socket.emit('pointConfirmed');
    });

    socket.on('finalScore', data => {
        roomHandler.submitScore(socket.id, data.score, data.roomCode);
        let playerCounter = roomHandler.getRoomCounter(data.roomCode);
        let submittedScores = roomHandler.getSubmittedScores(data.roomCode);
        let submittedScoresCount = Object.keys(submittedScores).length;
        if (playerCounter === submittedScoresCount) {
            let winner = utils.calculateWinner(submittedScores);
            let winnerName = roomHandler.getPlayerName(data.roomCode, winner);
            io.to(data.roomCode).emit('winner', winnerName);
            roomHandler.setOwner(data.roomCode, winner);
        }
    });

    socket.on('disconnect', data => {
        console.log(`Socket ${socket.id} disconnected`);
    });
  });
};
