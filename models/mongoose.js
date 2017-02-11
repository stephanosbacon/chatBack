'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var bluebird = require('bluebird');
mongoose.Promise = bluebird;


var db = mongoose.connection;

db.on('connecting', function () {
  console.log('connecting to MongoDB...');
});

db.on('error', function (error) {
  console.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});
db.on('connected', function () {
  console.log('MongoDB connected!');
});
db.once('open', function () {
  console.log('MongoDB connection opened!');
});
db.on('reconnected', function () {
  console.log('MongoDB reconnected!');
});
db.on('disconnected', function () {
  console.log('MongoDB disconnected!');
  mongoose.connect(config.databaseUrl, {
    server: {
      /* jshint ignore:start */
      auto_reconnect: true
      /* jshint ignore:end */
    }
  });
});

mongoose.connect(config.databaseUrl, {
  server: {
    /* jshint ignore:start */
    auto_reconnect: true
    /* jshint ignore:end */
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var UserModel = require('./UserModel.js');
var ChannelModel = require('./ChannelModel.js');

module.exports.UserModel = UserModel;
module.exports.ChannelModel = ChannelModel;
