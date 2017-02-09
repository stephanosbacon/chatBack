'use strict';

let config = include('config/config-dev.js');

const serverHost = (process.env.SERVER_HOST || 'localhost');

config.serverUrl = config.protocol + '://' + serverHost + ':' + config.port;

config.webSocketUrl =
  config.wsProtocol + '://' + serverHost + ':' + config.port +
  '/api/channels?token=';

module.exports = config;
