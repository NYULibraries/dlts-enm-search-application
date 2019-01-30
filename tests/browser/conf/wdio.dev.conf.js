'use strict';

let merge        = require( 'deepmerge' );
let wdioMainConf = require( './wdio.main.conf.js' );

exports.config = merge( wdioMainConf.config, {
    baseUrl            : 'http://devweb1.dlib.nyu.edu/enm/',
    enmGoogleAnalytics : false,
} );
