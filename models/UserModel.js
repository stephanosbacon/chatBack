"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  "username": String,
  "name": String,
  "email": {
    "type": String,
    "unique": true
  },
  "status": String
});


UserSchema.statics.create = function (obj, cb) {
  var UserModel = mongoose.model('User');
  var User = new UserModel({
    username: obj.email.replace('@', '__')
      .replace('.', '__'),
    name: obj.name,
    email: obj.email,
    status: obj.status ? obj.status : "status free"
  });
  User.save(cb);
};

UserSchema.statics.update = function (id, obj, cb) {
  UserModel.findOne({
    _id: id
  }, function (err, User) {
    if (err) {
      cb(err, null);
    } else if (!User) {
      cb(null, null);
    } else {
      User.name = obj.name ? obj.name : User.name;
      User.email = obj.email ? obj.email : User.email;
      User.status = req.body.status ? req.body.status : User.status;
      if (obj.email) {
        User.username = User.email.replace('@', '__');
      }
      User.save(cb);
    }
  })
};

UserSchema.statics.findByName = function (name, cb) {

};

var UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
