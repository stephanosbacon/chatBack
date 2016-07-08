"use strict";

var mongoose = require('mongoose');
var UserModel = mongoose.model('User');

/**
 * UserController.js
 *
 * @description :: Server-side logic for managing Users.
 */
module.exports = {

  /**
   * UserController.list()
   */
  list: function (req, res) {
    UserModel.find(function (err, Users) {
      if (err) {
        return res.status(500).json({
          message: 'Error getting Users.'
        });
      }
      return res.json(Users);
    });
  },

  /**
   * UserController.show()
   */
  show: function (req, res) {
    var id = req.params.id;
    UserModel.findOne({_id: id}, function (err, User) {
      if (err) {
        return res.status(500).json({
          message: 'Error getting user',
          userid: id
        });
      }
      if (!User) {
        return res.status(404).json({
          message: 'No such user'
        });
      }
      return res.status(200).json({
        'name': User.name,
        'email': User.email,
        'username': User.username,
        'status': User.status,
        'id': User._id
      });
    });
  },

  /**
   * UserController.create()
   */
  create: function (req, res) {
    var User = UserModel.create(req.body,
      function (err, User) {
        if (err) {
          return res.status(500).json({
            message: 'Error saving User',
            error: err
          });
        }
        return res.json({
          message: 'saved',
          _id: User._id
        });
      });
  },

  /**
   * UserController.update()
   */
  update: function (req, res) {
    var id = req.params.id;
    UserModel.update(id, req.body, function (err, User) {
      if (err) {
        return res.status(500).json({
          message: 'Error saving user',
          error: err
        });
      }
      if (!User) {
        return res.status(404).json({
          message: 'no such user'
        });
      }

      return res.status(200).json(User);
    });
  },

  /**
   * UserController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;
    UserModel.findByIdAndRemove(id, function (err, User) {
      if (err) {
        return res.json(500, {
          message: 'Error getting User.'
        });
      }
      return res.json(User);
    });
  }
};