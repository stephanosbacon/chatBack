'use strict';

let fs = require('fs');
let normalizePort = include('config/normalizePort');

let httpsOptions = {
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.crt')
};

let port = normalizePort(process.env.PORT || '3000');
let databaseUrl = (process.env.MONGO_URL || 'mongodb://localhost/chatter');

let secrets = include('keys/secrets.js');

module.exports = {
  'httpsOptions': httpsOptions,
  'port': port,
  'databaseUrl': databaseUrl,
  'secrets': secrets
};

process.env.DEBUG = 'chatBack/*';
