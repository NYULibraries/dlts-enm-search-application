'use strict';

let merge        = require( 'deepmerge' );
let wdioMainConf = require( './wdio.main.conf.js' );

exports.config = merge( wdioMainConf.config, {
    baseUrl            : 'https://enm-stage.dlib.nyu.edu/',
    enmGoogleAnalytics : false,
} );
