'use strict';

var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var handleErrorsAndDo = require('./handleErrorsAndDo.js');

module.exports.login = function (req, res) {
  UserModel.findOne({
      email: req.body.email
    },
    handleErrorsAndDo(res, (User) => {
      res.cookie('user', User._id)
        .status(200)
        .json({
          '_id': User._id
        })
        .end();
    }));
};

module.exports.list = function (req, res) {
  UserModel.find(handleErrorsAndDo(res,
    (Users) => {
      res.json(Users)
        .end();
    }));
};

module.exports.show = function (req, res) {
  var id = req.params.id;
  UserModel.findOne({
    _id: id
  }, handleErrorsAndDo(res,
    (User) => {
      res.status(200)
        .json({
          'name': User.name,
          'email': User.email,
          'username': User.username,
          'status': User.status,
          '_id': User._id
        })
        .end();
    }));
};


function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  });
}
let userInfo = setUserInfo(user);
token: 'JWT' + generateToken(userInfo),
  user: userInfo
});
});
}
);
};

// Set user info from request
function setUserInfo(request) {
  return {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email,
    role: request.role,
  };

  module.exports.register = function (req, res, next) {
    UserModel.register(req.body, handleErrorsAndDo(res,
      (User) => {
        res.status(200)
          .json({
            message: 'saved',
            _id: User._id
          })
          .end();
      }));
  };

  module.exports.update: function (req, res) {
    var id = req.params.id;
    UserModel.update(id, req.body, handleErrorsAndDo(res,
      (User) => {
        res.status(200)
          .json(User)
          .end();
      }));
  };

  module.exports.remove: function (req, res) {
    var id = req.params.id;
    UserModel.findByIdAndRemove(id, handleErrorsAndDo(res,
      (User) => {
        res.status(200)
          .json(User)
          .end();
      }));
  };
