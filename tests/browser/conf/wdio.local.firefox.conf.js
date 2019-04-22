'use strict';

let wdioLocalConf = require( './wdio.local.conf.js' );

wdioLocalConf.config.capabilities = [
    {
        // maxInstances can get overwritten per capability. So if you have an in-house Selenium
        // grid with only 5 firefox instance available you can make sure that not more than
        // 5 instance gets started at a time.
        maxInstances         : 8,
        //
        browserName          : 'firefox',
        'moz:firefoxOptions' : {
            // flag to activate Firefox headless mode (see https://github.com/mozilla/geckodriver/blob/master/README.md#firefox-capabilities for more details about moz:firefoxOptions)
            args : [ '-headless' ],
        },
    },
];

wdioLocalConf.config.mochaOpts.timeout = 99999;

exports.config = wdioLocalConf.config;
