const DEFAULT_SOLR_HOST = 'localhost';
const DEFAULT_SOLR_PORT = 8983;

let solrHost;
let solrPort;

export async function $fetch( path, options ) {
    const finalOptions = Object.assign( {}, {
        headers     : {
            'Content-Type' : 'application/json',
        },
    }, options );

    const requestUrl = `http://${ solrHost }:${ solrPort }${ path }`;
    const response = await fetch( requestUrl, finalOptions );

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

export default {
    install( Vue, options ) {
        // Plugin options
        solrHost = options.solrHost || DEFAULT_SOLR_HOST;
        solrPort = options.solrPort || DEFAULT_SOLR_PORT;

        // Fetch
        Vue.prototype.$fetch = $fetch;
    },
};
