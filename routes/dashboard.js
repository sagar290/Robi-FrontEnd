var express = require('express');
var query = require('../config/dbquery');
var bcrypt = require('bcryptjs');
var moment = require('moment');
var router = express.Router();


router.use('/', isLoggedIn);

router.get('/', function(req, res) {
    var coursesPromise = query.listCourses(req.user.region);
    coursesPromise.then(function(courses) {
        var ids = [];
        var progresses = [];
        var courseFound = false;
        courses.forEach(function(course) {
            var id = bcrypt.hashSync(course.id, bcrypt.genSaltSync(10), null);
            ids.push(id);
            req.user.courses.forEach(function(complete) {
                if(complete.course_id == course.id) {
                    courseFound = true;
                    var progress = (complete.lessons.length * 100)/(course.lessons.length);
                    progresses.push(progress);
                }
            });
            if(!courseFound) {
                progresses.push(0);
            }
            courseFound = false;
        });
        var data = {
            user: req.user,
            courses: courses,
            ids: ids,
            progresses: progresses
        }
        res.render('dashboard/courses', data);
    });

});

router.get('/courses/:course', function(req, res) {
    var coursePromise = query.findCourse(req.params.course);
    coursePromise.then(function(course) {
        var courseStarted = false;
        var completedLessons = [];
        req.user.courses.forEach(function(complete) {
            if(complete.course_id == course.id) {
                courseStarted = true;
                completedLessons = complete.lessons;
            }
        });

        getLessons(course).then(function(lessons) {
            var data = {
                user: req.user,
                lessons: lessons,
                course: course,
                started: courseStarted,
                lessonsComplete: completedLessons
            }

            res.render('dashboard/lessons', data);
        });

    });

});

router.get('/lessons/:lesson', function(req, res) {
    var lessonPromise = query.findLesson(req.params.lesson);
    lessonPromise.then(function(less) {
        var videoId = getId(less.video_url);
        less.video_url = '//www.youtube.com/embed/'+videoId;
        var data = {
            lesson: less,
            user: req.user
        }
        res.render('dashboard/lesson', data);
    });
});

router.get('/quizzes/:quiz', function(req, res) {
    var quizPromise = query.findQuiz(req.params.quiz);
    quizPromise.then(function(quiz) {
        var data = {
            user: req.user,
            quiz: quiz
        }
        res.render('dashboard/quiz', data);
    });
});

router.post('/quizzes/:quiz', function(req, res) {
    var score = 0;
    var quizPromise = query.findQuiz(req.params.quiz);
    quizPromise.then(function(quiz) {

        var index = 0;
        for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                var item = req.body[key];
                if(item == quiz.answers[index]) {
                    score += 1;
                }
            }
            index += 1;
        }
        var percentage = (score*100)/(index);
        //  res.send("Your scored: " + percentage);
        var lessonPromise = query.findLessonWithQuiz(quiz.id);
        lessonPromise.then(function(lesson) {
            // console.log(lesson.id);
            var coursePromise = query.findCourseWithLesson(lesson.id);
            coursePromise.then(function(course) {
                var course;
                console.log(course.id);
                var course_id = course.id;
                var courseStarted,quizTaken = false;
                req.user.courses.forEach(function(complete) {
                    if(complete.course_id == course_id) {
                        console.log("Course Found");
                        courseStarted = true;
                        // remove the item
                        req.user.courses.pull(complete);
                        course = complete;
                        if(course.lessons.indexOf(lesson.id) == -1) {
                            console.log("Lesson being added...");
                            course.lessons.push(lesson.id);
                        }
                        else {
                            console.log("Lesson already exists!");
                        }

                        course.quizzes.forEach(function(cquiz) {
                            if(cquiz.quiz_id == quiz.id) {
                                quizTaken = true;
                                console.log("Quiz taken before");
                                cquiz.percentage = percentage;
                            }
                        });

                        if(!quizTaken) {
                            var quizObject = {
                                quiz_id : quiz.id,
                                percentage : percentage
                            }

                            course.quizzes.push(quizObject);
                        }
                        course.dateUpdated = moment().format('L');
                    }
                });
                if(!courseStarted) {
                    var completedLessons = [],
                        completedQuizzes = [];
                    completedLessons.push(lesson.id);
                    completedQuizzes.push({quiz_id: quiz.id, percentage: percentage});

                    course = {
                        course_id: course_id,
                        lessons: completedLessons,
                        quizzes: completedQuizzes,
                        dateCreated: moment().format('L'),
                        dateUpdated: moment().format('L')
                    }
                }

                req.user.courses.push(course);
                req.user.save();

            });
        });
        // var data = {
        //     lesson: lesson,
        //     user: req.user
        // }
        // res.render('dashboard/lesson', data);
        res.send("Hey");
    });

});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}

function getLessons(course) {

    var promises = course.lessons.map(function(lessonid) {
        return query.findLesson(lessonid);
    });

    return Promise.all(promises);
}

function getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
}

module.exports = router;
