"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChannelSchema = new Schema({
  "users": [{
    "type": mongoose.Schema.Types.ObjectId,
    "ref": "User"
  }],
  "messages": [{
    "text": String,
    "postedTime": Date,
    "postedBy": {
      "type": mongoose.Schema.Types.ObjectId,
      "ref": "User"
    }
  }],
  "name": String
});


ChannelSchema.statics.getUserChannels = function (userid, cb) {
  ChannelModel.find({
    "users": userid
  }, cb);
};

var ChannelModel = mongoose.model('Channel', ChannelSchema);

module.exports = ChannelModel;
