'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Status = include('util/status.js');

var ChannelSchema = new Schema({
  'users': [{
    'type': mongoose.Schema.Types.ObjectId,
    'ref': 'User'
  }],
  'messages': [{
    'text': String,
    'postedTime': Date,
    'postedBy': {
      'type': mongoose.Schema.Types.ObjectId,
      'ref': 'User'
    }
  }],
  'name': String
});

module.exports.mongooseModel = mongoose.model('Channel', ChannelSchema);
var ChannelModel = module.exports.mongooseModel;

module.exports.getChannelsForUser = function (userid, cb) {
  ChannelModel.find({
    'users': userid
  }, (err, obj) => {
    if (err != null || obj == null) {
      cb(new Status(404, 'Error getting or saving object', err), null);
    } else {
      cb(new Status(200, 'alls well', null), obj);
    }
  });
};

module.exports.getAllChannels = function (cb) {
  ChannelModel.find({})
    .select('-messages')
    .exec((err, obj) => {
      if (err != null || obj == null) {
        cb(new Status(404, 'Error getting or saving object', err), null);
      } else {
        cb(new Status(200, 'alls well', null), obj);
      }
    });
};

module.exports.createChannel = function (obj, cb) {
  let channel = new ChannelModel({
    users: obj.users,
    messages: [],
    name: obj.name
  });
  channel.save((err, obj) => {
    if (err !== null || obj === null) {
      cb(new Status(404, 'Error getting or saving object', err), null);
    } else {
      cb(new Status(201, 'Channel ' + channel.name + ' created'), {
        name: channel.name,
        _id: channel.id,
        users: channel.users
      });
    }
  });
};

module.exports.deleteChannel = function (channelId, cb) {
  ChannelModel.findByIdAndRemove(channelId, (err, channel) => {
    if (err != null || channel == null) {
      cb(new Status(404, 'Error getting or deleting object', err), null);
    } else {
      cb(new Status(201, 'channel removed', null), channel);
    }
  });
};

module.exports.addUserToChannel = function (channelId, userId, cb) {
  ChannelModel.findOne({
    _id: channelId
  }, (err, channel) => {
    if (err != null || channel == null) {
      cb(new Status(404, 'Error getting or saving object', err), null);
    } else {
      channel.users.push(userId);
      channel.save((err, savedChannel) => {
        cb(new Status(err != null ? 500 : 201,
          err != null ? 'Error getting or saving object' : null,
          err), savedChannel);
      });
    }
  });
};

module.exports.removeUserFromChannel = function (channelId, userId, cb) {
  ChannelModel.findOne({
    _id: channelId
  }, (err, channel) => {
    if (err != null || channel == null) {
      cb(new Status(404, 'Error getting or saving object', err), null);
    } else {
      let index = channel.users.indexOf(userId);
      if (index >= -1) {
        channel.users.splice(index, 1);
      }
      channel.save((err, savedChannel) => {
        cb(new Status(err != null ? 500 : 201,
          err != null ? 'Error getting or saving object' : null,
          err), savedChannel);
      });
    }
  });
};

module.exports.addMessageToChannel = function (channelId,
  postedBy, message, cb) {
  ChannelModel.findOne({
    _id: channelId
  }, (err, channel) => {
    if (err != null || channel == null) {
      cb(new Status(404, 'Error getting or saving object', err), null);
    } else {
      let msg = {
        text: message,
        postedBy: postedBy,
        postedTime: new Date()
      };
      channel.messages.push(msg);
      channel.save((err) => {
        if (err != null) {
          cb(new Status(500, 'Error getting or saving object', err), null);
        } else {
          msg.channelId = channelId;
          cb(new Status(201, 'alls well', null), msg);
        }
      });
    }
  });
};

module.exports.getSimpleChannel = function (channelId, cb) {
  return ChannelModel.findById(channelId)
    .select('-messages')
    .exec((err, channel) => {
      if (err != null || channel == null) {
        return cb(new Status(404, 'bad channel', err), null);
      } else {
        cb(new Status(200, 'found channel', null), channel);
      }
    });
};

module.exports.getFullChannel = function (channelId, cb) {
  return ChannelModel.findById(channelId)
    .exec((err, channel) => {
      if (err != null || channel == null) {
        return cb(new Status(404, 'bad channel', err), null);
      } else {
        cb(new Status(200, 'found channel', null), channel);
      }
    });
};
