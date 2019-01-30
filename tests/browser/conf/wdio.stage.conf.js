'use strict';

let merge        = require( 'deepmerge' );
let wdioMainConf = require( './wdio.main.conf.js' );

exports.config = merge( wdioMainConf.config, {
    baseUrl            : 'http://stage.dlib.nyu.edu/enm/',
    enmGoogleAnalytics : false,
} );
