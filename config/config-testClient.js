'use strict';

let config = include('config/config-dev.js');

config.serverUrl = 'https://localhost:' + config.port;

module.exports = config;
