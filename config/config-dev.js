'use strict';

const fs = require('fs');
const normalizePort = include('config/normalizePort');

const protocol = process.env.PROTOCOL || 'https';
const port = normalizePort(process.env.PORT || '3000');
const databaseUrl = (process.env.MONGO_URL || 'mongodb://localhost/chatter');
const jwtSecret = (process.env.JWT_SECRET || include('keys/secrets.js')
  .jwtSecret);

const httpOptions = protocol === 'https' ? {
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.crt')
} : null;

module.exports = {
  'protocol': protocol,
  'wsProtocol': protocol === 'https' ? 'wss' : 'ws',
  'httpOptions': httpOptions,
  'port': port,
  'databaseUrl': databaseUrl,
  'secrets': {
    'jwtSecret': jwtSecret
  }
};

process.env.DEBUG = 'chatBack/*';
