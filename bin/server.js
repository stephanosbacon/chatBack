'use strict';

let app = require('./app');
// let debug = require('debug')('chatBack:server');
let http = require(config.protocol);

let options = config.httpOptions;
let port = config.port;

app.set('port', port);

// Create http(s) server
const server = (options == null) ?
  http.createServer(app) : http.createServer(options, app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

app.server = server;

// Create Websocket server
const url = require('url');
const queryString = require('query-string');
const ws = require('ws');

const WebSocketServer = ws.Server;

const auth = include('auth/passport');
const verifyJwtToken = auth.verifyJwtToken;
const userSocketMap = {};

function getUserInfoFromUrl(youAreEl) {
  let parsedUrl = url.parse(youAreEl);
  let parsedQuery = queryString.parse(parsedUrl.query);
  let userInfo = verifyJwtToken(parsedQuery.token);
  return userInfo;
}

const wss = new WebSocketServer({
  'server': server,
  'path': '/api/channels',
  'verifyClient': function (info) {
    let userInfo = getUserInfoFromUrl(info.req.url);
    if (userInfo == null) return false;
    if (!userSocketMap[userInfo._id]) {
      userSocketMap[userInfo._id] = {
        sockets: []
      };
    }
    return true;
  }
});

wss.on('error', (error) => {
  console.log(error);
});

wss.on('connection', (ws) => {
  let userInfo = getUserInfoFromUrl(ws.upgradeReq.url);
  userSocketMap[userInfo._id].sockets.push(ws);
});

app.webSocketServer = wss;

wss.broadcast = function (channel, message) {
  channel.users.forEach((item) => {
    if (userSocketMap[item] && userSocketMap[item].sockets != null) {
      userSocketMap[item].sockets.forEach((item) => {
        item.send(JSON.stringify(message));
      });
    }
  });
};

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    console.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
  case 'EADDRINUSE':
    console.error(bind + ' is already in use');
    process.exit(1);
    break;
  default:
    throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  console.log('Listening on ' + bind);
}

module.exports = server;
