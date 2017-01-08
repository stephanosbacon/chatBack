"use strict";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

require('./invalidPaths');
require('./api/users');
require('./api/channels');
require('./sockets');
