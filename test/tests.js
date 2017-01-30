'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let config = require(process.cwd() + '/config')('testClient');
let include = config.include;

console.log(process.cwd());

include('test/models/UserModelTest.js');
include('test/api/users');
include('test/models/ChannelModelTest.js');
include('test/api/channels');
//require('./sockets/sockets.js');
require('./api/invalidPaths');
