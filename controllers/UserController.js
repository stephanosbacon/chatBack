"use strict";

var mongoose = require('mongoose');
var UserModel = mongoose.model('User');
var handleErrorsAndDo = require('./handleErrorsAndDo.js');

/**
 * UserController.js
 *
 * @description :: Server-side logic for managing Users.
 */
module.exports = {
  /**
   * UserController.login()
   */
  login: function (req, res) {
    UserModel.findOne({"email": req.body.email},
      handleErrorsAndDo(res, (User) => {
        res.cookie('user', User._id)
          .status(200).json({'id' : User._id}).end();
      }));
  },
  
  /**
   * UserController.list()
   */
  list: function (req, res) {
    UserModel.find(handleErrorsAndDo(res,
      (Users) => { res.json(Users).end(); }));
  }
  ,

  /**
   * UserController.show()
   */
  show: function (req, res) {
    var id = req.params.id;
    UserModel.findOne({_id: id}, handleErrorsAndDo(res,
      (User) => {
        res.status(200)
          .json({
            'name': User.name,
            'email': User.email,
            'username': User.username,
            'status': User.status,
            'id': User._id
          })
          .end();
      }));
  }
  ,

  /**
   * UserController.create()
   */
  create: function (req, res) {
    UserModel.create(req.body, handleErrorsAndDo(res,
      (User) => {
        res.status(200)
          .json({
            message: 'saved',
            _id: User._id
          })
          .end();
      }));
  }
  ,

  /**
   * UserController.update()
   */
  update: function (req, res) {
    var id = req.params.id;
    UserModel.update(id, req.body, handleErrorsAndDo(res,
      (User) => {
        res.status(200).json(User).end();
      }));
  }
  ,

  /**
   * UserController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;
    UserModel.findByIdAndRemove(id, handleErrorsAndDo(res,
      (User) => {
        res.status(200).json(User).end();
      }));
  }
}
;