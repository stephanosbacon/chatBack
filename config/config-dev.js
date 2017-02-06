'use strict';

const fs = require('fs');
const normalizePort = include('config/normalizePort');

const protocol = process.env.PROTOCOL || 'https';


const httpOptions = protocol === 'https' ? {
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.crt')
} : {};

let port = normalizePort(process.env.PORT || '3000');
let databaseUrl = (process.env.MONGO_URL || 'mongodb://localhost/chatter');

let secrets = include('keys/secrets.js');

module.exports = {
  'protocol': protocol,
  'httpOptions': httpOptions,
  'port': port,
  'databaseUrl': databaseUrl,
  'secrets': secrets
};

process.env.DEBUG = 'chatBack/*';
