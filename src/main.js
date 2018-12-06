// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import EnmSolr from './plugins/enm-solr';
import router from './router';
import store from './store';

require( './assets/sass/bulma.scss' );

Vue.config.productionTip = false;

Vue.use( EnmSolr, {
    solrCorePath : '/solr/enm-pages/',
    solrHost     : process.env.SOLR_HOST,
    solrPort     : process.env.SOLR_PORT,
    solrProtocol : process.env.SOLR_PROTOCOL,
} );

// eslint-disable-next-line no-new
new Vue( {
    el         : '#app',
    router,
    store,
    components : { App },
    template   : '<App/>',
} );
