const roomHandler = require(__dirname + '/roomHandler');

exports.generateUniqueCode = function(){
    let exist = false;
    let code;
    do {
      code = generateFiveDigitCode();
      if (roomHandler.roomExists(code)) exist = true; 
    } while(exist);
    return code;
}

function generateFiveDigitCode() {
    return Math.floor(Math.random() * 89999) + 10000;
}

exports.calculateWinner =  function(scores) {
  return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}