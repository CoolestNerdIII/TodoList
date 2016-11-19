// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var auth = require('../../config/auth');

// define the schema for our user model
var userSchema = mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    local: {
        email: {type: String, unique: true, required: true},
        password: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    "use strict";
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    "use strict";
    return bcrypt.compareSync(password, this.local.password);
};

// generate a jwt for a user
userSchema.methods.generateJwt = function() {
    "use strict";
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.local.email,
        first_name: this.first_name,
        exp: parseInt(expiry.getTime() / 1000)
    }, auth.randomSecret);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
