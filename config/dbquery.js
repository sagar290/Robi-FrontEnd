module.exports = {
    listCourses: function(region) {
        var Course = require('../models/course');
        return Course.find({region: region}, function(error, results) {

        }).exec();
    },
    findCourse: function(course) {
        var Course = require('../models/course');
        return Course.findOne({course_name: course}, function(error, result) {

        }).exec();
    },
    findCourseWithLesson: function(lessonid) {
        var Course = require('../models/course');
        return Course.findOne({ lessons: {"$in": [lessonid]} }, function(err, result) {

        }).exec();
    },
    findLesson: function(lessonid) {
        var Lesson = require('../models/lesson');
        return Lesson.findOne({_id: lessonid}, function(error, result) {

        }).exec();
    },
    findLessonWithQuiz: function(quizid) {
        var Lesson = require('../models/lesson');
        return Lesson.findOne({quiz: quizid}, function(err, result) {

        }).exec();
    },
    findQuiz: function(quizid) {
        var Quiz = require('../models/quiz');
        return Quiz.findOne({_id: quizid}, function(error, result) {

        }).exec();
    }
}
