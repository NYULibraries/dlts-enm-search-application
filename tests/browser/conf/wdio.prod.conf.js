'use strict';

let merge        = require( 'deepmerge' );
let wdioMainConf = require( './wdio.main.conf.js' );

exports.config = merge( wdioMainConf.config, {
    baseUrl            : 'http://enm.dlib.nyu.edu/',
    enmGoogleAnalytics : true,
} );
