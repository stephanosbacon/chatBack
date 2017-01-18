#!/usr/bin/env node

"use strict";

var configFn = require('./config');

// global.config has all the config vars as a side effect of this call
configFn('dev');

include('bin/www');
