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

function getChannelsForUser(userid, cb) {
  let ChannelModel = mongoose.model('Channel');
  ChannelModel.find({
    'users': userid
  }, (err, obj) => {
    if (err != null || obj == null) {
      cb(new Status(404, 'Error getting or saving object', err), null);
    } else {
      cb(new Status(200, 'alls well', null), obj);
    }
  });
}

function getAllChannels(cb) {
  let ChannelModel = mongoose.model('Channel');
  ChannelModel.find({},
    (err, obj) => {
      if (err != null || obj == null) {
        cb(new Status(404, 'Error getting or saving object', err), null);
      } else {
        cb(new Status(200, 'alls well', null), obj);
      }
    });
}

function createChannel(obj, cb) {
  let ChannelModel = mongoose.model('Channel');
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
}

function deleteChannel(channelId, cb) {
  let ChannelModel = mongoose.model('Channel');
  ChannelModel.findByIdAndRemove(channelId, (err, channel) => {
    if (err != null || channel == null) {
      cb(new Status(404, 'Error getting or deleting object', err), null);
    } else {
      cb(new Status(201, 'channel removed', null), channel);
    }
  });
}

function addUserToChannel(channelId, userId, cb) {
  let ChannelModel = mongoose.model('Channel');
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
}

function removeUserFromChannel(channelId, userId, cb) {
  let ChannelModel = mongoose.model('Channel');
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
}

function addMessageToChannel(channelId, postedBy, message, cb) {
  let ChannelModel = mongoose.model('Channel');
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
}


var mm = mongoose.model('Channel', ChannelSchema);
module.exports = {
  mongooseModel: mm,

  // obj{name, users }, cb(status, obj (or list of objs))
  createChannel: createChannel,

  // channelId
  deleteChannel: deleteChannel,

  getChannel: function (channelId, cb) {
    return mm.findById(channelId)
      .select('-messages')
      .exec((err, channel) => {
        if (err != null || channel == null) {
          return cb(new Status(404, 'bad channel', err), null);
        } else {
          cb(new Status(200, 'found channel', null), channel);
        }
      });
  },

  // cb
  getAllChannels: getAllChannels,

  // userid, cb(status, user)
  getChannelsForUser: getChannelsForUser,
  // channelId, userId, cb(status, channel)
  addUserToChannel: addUserToChannel,

  // channelId, userId, cb(status, channel)
  removeUserFromChannel: removeUserFromChannel,

  // channelId, posedBy are both Object Ids (channel, user)
  // cb(Status, {_id: <channelId>})
  addMessageToChannel: addMessageToChannel
};
