#!/usr/bin/env node

"use strict";

let config = include('config/config-dev.js');
let normalizePort = include('config/normalizePort');

config.serverUrl = 'https://localhost:' + config.port;

module.exports = config;
