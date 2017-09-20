var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = new Schema({
    course_name: String,
    thumbnail_image: String,
    region: String,
    lessons: [Schema.ObjectId]
});

module.exports = mongoose.model('Course', courseSchema);
