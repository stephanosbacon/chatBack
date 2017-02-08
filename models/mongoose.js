'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var bluebird = require('bluebird');
mongoose.Promise = bluebird;


console.log('******' + config.databaseUrl);
mongoose.connect(config.databaseUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var UserModel = require('./UserModel.js');
var ChannelModel = require('./ChannelModel.js');

module.exports.UserModel = UserModel;
module.exports.ChannelModel = ChannelModel;
