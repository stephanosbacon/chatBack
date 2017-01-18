#!/usr/bin/env node

"use strict";

let fs = require('fs');
let normalizePort = include('config/normalizePort');
let httpsOptions = {
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.crt')
};

let port = normalizePort(process.env.PORT || '3000');
let databaseUrl = 'mongodb://localhost/chatter';

module.exports = {
  'httpsOptions': httpsOptions,
  'port': port,
  'databaseUrl': databaseUrl
}
