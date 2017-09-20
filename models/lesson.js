var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lessonSchema = new Schema({
    lesson_name: String,
    video_url: String,
    quiz: Schema.ObjectId
});

module.exports = mongoose.model('Lesson', lessonSchema);
