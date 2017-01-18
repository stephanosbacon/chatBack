"use strict";

var mongoose = require('mongoose');
var ChannelModel = mongoose.model('Channel');
var handleErrorsAndDo = require('./handleErrorsAndDo.js');

/**
 * ChannelController.js
 *
 * @description :: Server-side logic for managing Channels.
 */

function saveChannel(res, Channel, msg) {
  Channel.save(handleErrorsAndDo(res,
    (Channel) => {
      res.status(200)
        .json({
          'message': msg,
          'channelId': Channel._id
        })
        .end();
    }
  ));
}

module.exports = {

  /**
   * ChannelController.list()
   */
  list: function (req, res) {
    ChannelModel.find(handleErrorsAndDo(res,
      (Channels) => {
        res.status(200)
          .json(Channels)
          .end();
      }));
  },

  /**
   * ChannelController.showChannelsForUser()
   */
  showChannelsForUser: function (req, res) {

    var id = req.params.userid;
    ChannelModel.getUserChannels(id,
      handleErrorsAndDo(res,
        (Channels) => {
          res.status(200)
            .json(Channels)
            .end();
        }));
  },

  /**
   * ChannelController.showUsers()
   */
  showUsers: function (req, res) {
    var id = req.params.id;
    ChannelModel.findOne({
        _id: id
      },
      handleErrorsAndDo(res,
        (Channel) => {
          res.status(200)
            .json({
              'channelId': Channel._id,
              'users': Channel.users
            })
            .end();
        }));
  },

  /**
   * ChannelController.showMessages()
   */
  showMessages: function (req, res) {
    var id = req.params.id;
    ChannelModel.findOne({
        _id: id
      },
      handleErrorsAndDo(res,
        (Channel) => {
          res.status(200)
            .json({
              'channelId': Channel._id,
              'name': Channel.name,
              'messages': Channel.messages
            })
            .end();
        }))
  },

  /**
   * ChannelController.create()
   */
  create: function (req, res) {
    var Channel = new ChannelModel({
      users: req.body.users,
      messages: [],
      name: req.body.name
    });
    saveChannel(res, Channel, 'Channel ' + Channel.name + ' created');
  },

  /**
   * ChannelController.newMessage
   */
  newMessage: function (req, res) {
    var id = req.params.id;
    ChannelModel.findOne({
        _id: id
      },
      handleErrorsAndDo(res, (channel) => {
        if (!req.body || !req.body.message) {
          res.status(500)
            .json({
              'message': 'No message in body'
            })
            .end();
        } else {
          let user = req.cookies.user;
          let msg = {
            "text": req.body.message,
            "postedBy": user,
            "postedTime": new Date()
          };
          channel.messages.push(msg);
          req.socket.server.broadcast(channel, msg);
          saveChannel(res, channel, msg);
        }
      }));
  },

  /**
   * ChannelController.addUser
   */
  addUser: function (req, res) {
    var id = req.params.id;
    ChannelModel.findOne({
        _id: id
      },
      handleErrorsAndDo(res, (Channel) => {
        Channel.users.push(req.params.userid);
        saveChannel(res, Channel, 'user ' + req.params.userid + ' added');
      }));
  },

  /**
   * ChannelController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;
    ChannelModel.findByIdAndRemove(id,
      handleErrorsAndDo(res, (Channel) => {
        res.json(Channel)
          .end();
      }));
  }
};
