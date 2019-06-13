// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';

import App from './App';
import EnmSolr from './plugins/enm-solr';
import storeConfig from './store/store-config';

require( './assets/sass/bulma.scss' );

Vue.config.productionTip = false;

const enmSolrOptions = {
    solrCorePath : '/solr/enm-pages/',
    solrHost     : process.env.VUE_APP_SOLR_HOST,
    solrPort     : process.env.VUE_APP_SOLR_PORT,
    solrProtocol : process.env.VUE_APP_SOLR_PROTOCOL,
};

const params = new URLSearchParams( window.location.search );
const solrErrorSimulation = params.get( 'solrErrorSimulation' );
const solrOverrideUrl = params.get( 'solr' );

if ( solrErrorSimulation ) {
    enmSolrOptions.errorSimulation = solrErrorSimulation;
}

if ( solrOverrideUrl ) {
    const url = new URL( solrOverrideUrl );

    // Ports 80 and 443 are not returned by URL() if the protocol is http or https,
    // respectively, even if they are explicitly included in solrOverrideUrl.
    // We have Solr servers running on ports 80 and 443 because a decision was
    // made to use those port to accommodate certain edge cases -- see
    // https://jira.nyu.edu/jira/browse/NYUP-477 for details.
    let massagedPort = url.port;
    if ( ! url.port ) {
        if ( url.protocol === 'http:' ) {
            massagedPort = 80;
        } else if ( url.protocol === 'https:' ) {
            massagedPort = 443;
        } else {
            // Do nothing
        }
    }

    if ( url.protocol && url.hostname && massagedPort && url.pathname ) {
        enmSolrOptions.solrHost     = url.hostname;
        enmSolrOptions.solrPort     = massagedPort;
        enmSolrOptions.solrProtocol = url.protocol.replace( /:$/, '' );
        enmSolrOptions.solrCorePath = url.pathname;
    }
}

Vue.use( EnmSolr, enmSolrOptions );

Vue.use( Vuex );
const store = new Vuex.Store( storeConfig );

new Vue( {
    el         : '#app',
    store,
    components : { App },
    // Can't use template option unless in vue.config.js `runtimeCompiler` is set to true.
    // See https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    // template   : '<App/>',
    render     : h => h( App ),
} ).$mount( '#app' );
