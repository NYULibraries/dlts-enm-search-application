// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import EnmSolr from './plugins/enm-solr';
import router from './router';

require( './assets/sass/bulma.scss' );

Vue.config.productionTip = false;

Vue.use( EnmSolr, {
    solrHost     : 'dev-discovery.dlib.nyu.edu',
    solrPort     : 8983,
    solrCorePath : '/solr/enm-pages/',
} );

// eslint-disable-next-line no-new
new Vue( {
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
} );
