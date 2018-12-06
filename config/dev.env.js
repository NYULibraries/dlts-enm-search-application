'use strict';
const merge = require( 'webpack-merge' );
const prodEnv = require( './prod.env' );

module.exports = merge( prodEnv, {
    NODE_ENV: '"development"',

    SOLR_HOST: '"dev-discovery.dlib.nyu.edu"',
    SOLR_PORT: '8983',
    SOLR_PROTOCOL: '"http"',
} );
