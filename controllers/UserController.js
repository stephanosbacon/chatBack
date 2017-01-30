'use strict';

const jwt = require('jsonwebtoken');
const UserModel = include('models/UserModel.js');

const handleErrorsAndDo = require('./handleErrorsAndDo.js');
//const debug = require('debug')('chatBack/controllers/UserController');

let Status = include('util/status.js');

function generateToken(user) {
  return jwt.sign(user, config.secrets.jwtSecret, {
    expiresIn: 10080 // in seconds
  });
}

function setUserInfo(user) {
  return {
    _id: user._id,
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    email: user.email,
    role: user.role,
  };
}

function simplifyUser(user) {
  let tu = setUserInfo(user);
  tu.status = user.profile.status;
  delete tu.role;
  return tu;
}

function simplifyUsers(users) {
  return users.map((user) => {
    let tu = simplifyUser(user);
    return tu;
  });
}

module.exports.login = function (req, res) {
  const userInfo = setUserInfo(req.user);
  res.status(200)
    .json({
      token: 'JWT ' + generateToken(userInfo),
      user: userInfo
    });
};

module.exports.list = function (req, res) {
  UserModel.find(handleErrorsAndDo(res,
    (Users) => {
      let su = simplifyUsers(Users);
      res.status(200)
        .json(su)
        .end();
    }));
};

module.exports.show = function (req, res) {
  if (req.user != null) {
    res.status(200)
      .json(simplifyUser(req.user))
      .end();
  } else {
    res.status(401)
      .json(new Status(401, 'Not authorized'))
      .end();
  }
};

module.exports.register = function (req, res) {
  UserModel.register(req.body, (status, user) => {
    if (user != null) {
      res.status(status.code)
        .json(simplifyUser(user))
        .end();
    } else {
      res.status(status.code)
        .json(status)
        .end();
    }
  });
};

module.exports.update = function (req, res) {
  var id = req.params.id;
  UserModel.update(id, req.body, handleErrorsAndDo(res,
    (User) => {
      res.status(201)
        .json(simplifyUser(User))
        .end();
    }));
};

module.exports.remove = function (req, res) {
  var id = req.params.id;
  UserModel.findByIdAndRemove(id, handleErrorsAndDo(res,
    (User) => {
      res.status(200)
        .json(User)
        .end();
    }));
};
