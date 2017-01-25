'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
console.log(process.cwd());

require('./models/UserModelTest.js');
require('./api/users');

//require('./api/channels');
//require('./sockets/sockets.js');
//require('./api/invalidPaths');
