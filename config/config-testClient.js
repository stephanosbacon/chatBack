'use strict';

let config = include('config/config-dev.js');

const serviceHost = (process.env.SERVICE_HOST || 'localhost');

config.serverUrl = config.protocol + '://' + serviceHost + ':' + config.servicePort;

config.webSocketUrl =
  config.wsProtocol + '://' + serviceHost + ':' + config.servicePort +
  '/api/channels?token=';

module.exports = config;
