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

    const queryStringParams = [];
    Object.keys( params ).forEach( ( key ) => {
        const paramValue = params[ key ];

        // Some params like fq can be specified multiple times
        if ( Array.isArray( paramValue ) ) {
            paramValue.forEach( ( value ) => {
                queryStringParams.push( key + '=' + value );
            } );
        } else {
            queryStringParams.push( key + '=' + params[ key ] );
        }
    } );

    const queryString = queryStringParams.join( '&' );

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

async function solrSearch( query, queryFields, selectedTopicFacetItems ) {
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

    if ( selectedTopicFacetItems && selectedTopicFacetItems.length > 0 ) {
        params.fq = selectedTopicFacetItems.map( ( selectedTopicFacetItem ) => {
            return encodeURIComponent(
                'topicNames_facet:"'  +
                selectedTopicFacetItem.replace( /"/g, '\\"' ) +
                '"'
            );
        } );
    }

    try {
        return doFetch( params );
    } catch( e ) {
        throw e;
    }
}

async function solrPreviewEpub( isbn, query, queryFields, selectedTopicFacetItems ) {
    const params = {
        q: query,
        fl: 'pageLocalId,pageNumberForDisplay,pageSequenceNumber,epubNumberOfPages,score',
        fq: encodeURIComponent( 'isbn_facet:"' + isbn + '"' ),
        qf: queryFields.join( '%20' ),
        rows: 999,
        sort: 'pageSequenceNumber+asc',
    };

    if ( selectedTopicFacetItems ) {
        params.fq = [ params.fq ].concat(
            selectedTopicFacetItems.map( ( selectedTopicFacetItem ) => {
                return encodeURIComponent(
                    'topicNames_facet:"'                          +
                    selectedTopicFacetItem.replace( /"/g, '\\"' ) +
                    '"'
                );
            } )
        );
    }

    try {
        return doFetch( params );
    } catch( e ) {
        throw e;
    }
}

async function solrPreviewPage( isbn, pageNumberForDisplay, query, queryFields ) {
    const HIGHLIGHT_PRE = '<mark>';
    const HIGHLIGHT_POST = '</mark>';

    const qf = queryFields.join( '%20' );
    const highlightFields = qf.replace( 'topicNames', 'topicNamesForDisplay' );

    const params = {
        q: query,
        fl: 'topicNames_facet,topicNamesForDisplay,pageText',
        fq: [
            encodeURIComponent( 'isbn:' + isbn ),
            encodeURIComponent( 'pageNumberForDisplay: ' + pageNumberForDisplay ),
        ],
        hl: 'on',
        'hl.fl': highlightFields,
        'hl.fragsize': 0,
        'hl.simple.post': encodeURIComponent( HIGHLIGHT_POST ),
        'hl.simple.pre': encodeURIComponent( HIGHLIGHT_PRE ),
        qf: qf,
        rows: 1,
        sort: 'pageSequenceNumber+asc',
    };

    try {
        return doFetch( params );
    } catch( e ) {
        throw e;
    }
}

export default {
    install( Vue, options ) {
        // Plugin options
        solrHost     = options.solrHost     || DEFAULT_SOLR_HOST;
        solrPort     = options.solrPort     || DEFAULT_SOLR_PORT;
        solrCorePath = options.solrCorePath || DEFAULT_SOLR_CORE_PATH;

        Vue.prototype.$solrPreviewEpub = solrPreviewEpub;
        Vue.prototype.$solrPreviewPage = solrPreviewPage;
        Vue.prototype.$solrSearch = solrSearch;
    },
};
