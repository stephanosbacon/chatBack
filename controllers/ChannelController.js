"use strict";

var ChannelModel = require('../models/ChannelModel.js');

/**
 * ChannelController.js
 *
 * @description :: Server-side logic for managing Channels.
 */

function handleErrorsAndDo(_res, _cb) {
  let cb = _cb;
  let res = _res;
  return function (err, Channel) {
    if (err) {
      return res.status(500).json({
        message: 'Error getting or saving Channel.'
      });
    }
    if (!Channel) {
      return res.status(404).json({
        message: 'No such Channel'
      });
    }
    cb(Channel);
  }
}

function saveChannel(res, Channel, msg) {
  Channel.save(handleErrorsAndDo(res,
    (Channel) => {
      return res.status(200).json(
        {
          'message': msg,
          'channelId': Channel._id
        }
      );
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
        return res.status(200).json(Channels);
      }));
  },

  /**
   * ChannelController.showChannelsForUser()
   */
  showChannelsForUser: function (req, res) {
    var id = req.params.userid;
    ChannelModel.find({"users": id},
      handleErrorsAndDo(res,
        (Channels) => {
          return res.status(200).json(Channels)
        }));
  },

  /**
   * ChannelController.showUsers()
   */
  showUsers: function (req, res) {
    var id = req.params.id;
    ChannelModel.findOne({_id: id},
      handleErrorsAndDo(res,
        (Channel)=> {
          return res.status(200).json(
            {
              'channelId': Channel._id,
              'users': Channel.users
            });
        }));
  },

  /**
   * ChannelController.showMessages()
   */
  showMessages: function (req, res) {
    var id = req.params.id;
    ChannelModel.findOne({_id: id},
      handleErrorsAndDo(res,
        (Channel) => {
          return res.json(
            {
              'channelId': Channel._id,
              'name': Channel.name,
              'messages': Channel.messages
            });
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
    ChannelModel.findOne({_id: id},
      handleErrorsAndDo(res, (Channel) => {

        if (!req.body || !req.body.message) {
          return res.status(500).json({
            'message': 'No message in body'
          })
        }

        let msg = {
          "text": req.body.message,
          "postedBy": req.headers.user,
          "postedTime": new Date()
        };

        Channel.messages.push(msg);

        saveChannel(res, Channel, msg);
      }));
  },

  /**
   * ChannelController.addUser
   */
  addUser: function (req, res) {
    var id = req.params.id;
    ChannelModel.findOne({_id: id},
      handleErrorsAndDo(res, (Channel) => {
          Channel.users.push(req.params.userid);
          saveChannel(res, Channel, 'user ' + req.params.userid + ' added');
        }
      ));
  },

  /**
   * ChannelController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;
    ChannelModel.findByIdAndRemove(id,
      handleErrorsAndDo(res, (Channel)=> {
        return res.json(Channel);
      }
      ));
  }
};