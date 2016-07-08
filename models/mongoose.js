'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chatter')

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var UserModel = require('./UserModel.js');
var ChannelModel = require('./ChannelModel.js');

module.exports.UserModel = UserModel;
module.exports.ChannelModel = ChannelModel;