// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import EnmSolr from './plugins/enm-solr';
import store from './store';

require( './assets/sass/bulma.scss' );

Vue.config.productionTip = false;

const enmSolrOptions = {
    solrCorePath : '/solr/enm-pages/',
    solrHost     : process.env.VUE_APP_SOLR_HOST,
    solrPort     : process.env.VUE_APP_SOLR_PORT,
    solrProtocol : process.env.VUE_APP_SOLR_PROTOCOL,
};

const params = new URLSearchParams( window.location.search );
const solrOverrideUrl = params.get( 'solr' );

if ( solrOverrideUrl ) {
    const url = new URL( solrOverrideUrl );

    if ( url.protocol && url.hostname && url.port && url.pathname ) {
        enmSolrOptions.solrHost     = url.hostname;
        enmSolrOptions.solrPort     = url.port;
        enmSolrOptions.solrProtocol = url.protocol.replace( /:$/, '' );
        enmSolrOptions.solrCorePath = url.pathname;
    }
}

Vue.use( EnmSolr, enmSolrOptions );

new Vue( {
    el         : '#app',
    store,
    components : { App },
    // Can't use template option unless in vue.config.js `runtimeCompiler` is set to true.
    // See https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    // template   : '<App/>',
    render     : h => h( App ),
} ).$mount( '#app' );
