'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let config = require(process.cwd() + '/config')('testClient');
let include = config.include;

include('test/models/UserModelTest.js');
//include('test/models/ChannelModelTest.js');
//include('test/api/users');
//ninclude('test/api/channels');
//include('test/sockets/sockets.js');
//include('test/api/invalidPaths');
