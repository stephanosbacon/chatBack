'use strict';

let config = include('config/config-dev.js');

config.serverUrl = config.protocol + '://localhost:' + config.port;

module.exports = config;
