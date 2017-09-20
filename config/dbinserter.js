module.exports = {
    model: null,
    id: null,
    instance: null,
    insert: function(data) {
        if(!this.model) {
            console.log("Missing Model Error");
        }
        else {
            if(this.model == 'trainee') {
                var bcrypt = require('bcryptjs');
                var User = require('../models/trainees');
                var newUser = new User();
                this.instance = newUser;
                this.id = newUser._id;
                newUser.username = data.username;
                newUser.region = data.region;
                newUser.password = newUser.generateHash(data.password);
                newUser.save(function(err) {
                    if(err) console.log(err);
                });
            }
        }
    }
}
