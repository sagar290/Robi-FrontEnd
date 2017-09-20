var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var moment = require('moment');

var traineeSchema = new Schema({
    username: Number,
    password: String,
    region: String,
    courses: {type: Array, default: []}
});

traineeSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

traineeSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

traineeSchema.methods.updateCourse = function(courseid, lessonid, quizid, percentage) {
    var courseStarted = false;
    this.courses.forEach(function(course) {
        if(courseid == course.id) {
            courseStarted = true;
            if(course.lessons.indexOf(lessonid) == -1) {
                course.lessons.push(lessonid);
            }
            var quizTakenBefore = false;
            course.quizzes.forEach(function(completeQuiz) {
                if(quizid == completeQuiz.quiz_id) {
                    console.log("Quiz taken before!!");
                    quizTakenBefore = true;
                    completeQuiz.percentage = percentage;
                }
            });

            if(!quizTakenBefore) {
                course.quizzes.push({quiz_id: quizid, percentage: percentage});
            }
            course.dataUpdated = moment().format();
            this.save();
        }
    });

    return courseStarted;
}

module.exports = mongoose.model('Trainee', traineeSchema);
