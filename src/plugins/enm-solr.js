const DEFAULT_SOLR_HOST      = 'localhost';
const DEFAULT_SOLR_PORT      = 8983;
const DEFAULT_SOLR_CORE_PATH = '/solr/enm-pages/';

let solrHost;
let solrPort;
let solrCorePath;

async function doFetch( params ) {
    params = Object.assign( params, {
        q : encodeURIComponent( params.q ),
        defType : 'edismax',
        indent : 'on',
        wt : 'json',
    } );

    const queryString = Object.keys( params )
        .map( key => key + '=' + params[ key ] )
        .join( '&' );

    const requestUrl = `http://${ solrHost }:${ solrPort }${ solrCorePath }select?${ queryString }`;
    const response = await fetch( requestUrl );

    if ( response.ok ) {
        const data = await response.json();

        return data;
    } else {
        const message  = await response.text();
        const error    = new Error( message );
        error.response = response;

        throw error;
    }
}

async function search( params ) {
    return doFetch( params );
}

export default {
    install( Vue, options ) {
        // Plugin options
        solrHost     = options.solrHost     || DEFAULT_SOLR_HOST;
        solrPort     = options.solrPort     || DEFAULT_SOLR_PORT;
        solrCorePath = options.solrCorePath || DEFAULT_SOLR_CORE_PATH;

        // Fetch
        Vue.prototype.$search = search;
    },
};
