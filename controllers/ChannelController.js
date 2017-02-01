'use strict';

var models = include('models/mongoose.js');

var handleErrorsAndDo = require('./handleErrorsAndDo.js');

function simplifyChannel(channel) {
  return {
    name: channel.name,
    _id: channel._id,
    users: channel.users
  };
}

function simplifyChannels(channels) {
  return channels.map((channel) => {
    return simplifyChannel(channel);
  });
}

module.exports.getAllChannels = function (req, res) {
  models.ChannelModel.getAllChannels((status, channels) => {
    res.status(status.code)
      .json(simplifyChannels(channels));
  });
};

module.exports.getChannelsForUser = function (req, res) {
  var id = req.params.userid;
  models.ChannelModel.getChannelsForUser(id, (status, channels) => {
    res.status(status.code)
      .json(simplifyChannels(channels));
  });
};

module.exports.showUsers = function (req, res) {
  var id = req.params.id;
  models.ChannelModel.findOne({
      _id: id
    },
    handleErrorsAndDo(res,
      (channel) => {
        res.status(200)
          .json({
            '_id': channel._id,
            'users': channel.users,
            'name': channel.name
          })
          .end();
      }));
};

module.exports.showMessages = function (req, res) {
  var id = req.params.id;
  models.ChannelModel.findOne({
      _id: id
    },
    handleErrorsAndDo(res,
      (channel) => {
        res.status(200)
          .json({
            '_id': channel._id,
            'name': channel.name,
            'messages': channel.messages
          })
          .end();
      }));
};

module.exports.create = function (req, res) {
  models.ChannelModel.createChannel(req.body,
    (status, channel) => {
      if (channel != null) {
        res.status(status.code)
          .json({
            message: status.message,
            _id: channel._id
          })
          .end();
      } else {
        res.status(status.code)
          .json(status)
          .end();
      }
    });
};


module.exports.addMessageToChannel = function (req, res) {
  let channelId = req.params.id;
  let postedBy = req.user._id;
  let message = req.body.message;
  models.ChannelModel.addMessageToChannel(channelId, postedBy, message,
    (status, msg) => {
      res.status(status.code)
        .json(msg)
        .end();
      if (status.code === 201) {
        res.app.webSocketServer.broadcast(channelId, msg);
      }
    });
};

module.exports.addUserToChannel = function (req, res) {
  var channelId = req.params.id;
  var userId = req.params.userid;
  models.ChannelModel.addUserToChannel(channelId,
    userId, (status, channel) => {
      res.status(status.code)
        .json(channel)
        .end();
    });
};

module.exports.removeUserFromChannel = function (req, res) {
  var channelId = req.params.id;
  var userId = req.params.userid;
  models.ChannelModel.removeUserFromChannel(channelId,
    userId, (status, channel) => {
      res.status(status.code)
        .json(channel)
        .end();
    });
};
