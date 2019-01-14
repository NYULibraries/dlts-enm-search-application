const argv = require( 'minimist' )( process.argv.slice( 2 ) );

const solrFake = require( './' );

const solrResponsesDirectory = argv._.pop();

let solrRequestRewriterMiddleware;

let port = argv.port || undefined;

if ( argv.middleware ) {
    solrRequestRewriterMiddleware = require( argv.middleware );
}

solrFake.startSolrFake( solrResponsesDirectory, port, solrRequestRewriterMiddleware );
