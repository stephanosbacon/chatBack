'use strict';

let config = include('config/config-dev.js');

config.serverUrl = config.protocol + '://localhost:' + config.port;

config.webSocketUrl =
  config.wsProtocol + '://localhost:3000/api/channels?token=';

module.exports = config;
