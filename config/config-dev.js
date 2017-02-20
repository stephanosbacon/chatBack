'use strict';

const fs = require('fs');
const normalizePort = include('config/normalizePort');

const protocol = process.env.PROTOCOL || 'http';
const servicePort = normalizePort(process.env.SERVICE_PORT || '3000');
const mongoHost = (process.env.MONGO_SERVICE_HOST || 'localhost');
const mongoPort = (process.env.MONGO_SERVICE_PORT || '27017');
const certsPath = (process.env.CERTS_PATH);
const jwtSecret = (process.env.JWT_SECRET ||
  'YOU MUST SET THE JWT_SECRET ENVIRONMENT VARIABLE (use secret in openshift)');

const databaseUrl = 'mongodb://' + mongoHost + ':' + mongoPort + '/chatter';

const httpOptions = protocol === 'https' ? {
  key: fs.readFileSync(certsPath + '/server.key'),
  cert: fs.readFileSync(certsPath + '/server.crt')
} : null;

module.exports = {
  'protocol': protocol,
  'wsProtocol': protocol === 'https' ? 'wss' : 'ws',
  'httpOptions': httpOptions,
  'servicePort': servicePort,
  'databaseUrl': databaseUrl,
  'secrets': {
    'jwtSecret': jwtSecret
  }
};

process.env.DEBUG = 'chatBack/*';
