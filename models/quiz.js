var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizSchema = new Schema({
    questions: [
        {
            question: String,
            a: String,
            b: String,
            c: String,
            d: String
        }
    ],
    answers: [String]
});

module.exports = mongoose.model('Quiz', quizSchema);
