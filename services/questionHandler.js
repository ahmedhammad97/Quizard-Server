const questionSet = require(__dirname + '/../questions');

/**
 * settings: Object {category: String, number: Number, time: Number}
 */
exports.generateQuestions = function(settings) {
    return shuffleArray(questionSet[settings.category]).slice(0, settings.number);
}

function shuffleArray(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}