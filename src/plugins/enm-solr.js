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

async function search( query, queryFields ) {
    const params = {
        q: query,
        'facet.field': 'topicNames_facet',
        'facet.limit': '-1',
        'facet.mincount': '1',
        'facet.sort': 'count',
        facet: 'on',
        fl: 'title,authors,publisher,yearOfPublication,score',
        'group.field': 'isbn',
        group: 'true',
        'group.limit': '999',
        qf: queryFields.join( '%20' ),
        rows: '1999',
        sort: 'score%20desc,title_facet%20asc',
    };

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
