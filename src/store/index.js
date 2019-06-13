import Vue from 'vue';
import Vuex from 'vuex';

import storeConfig from './store-config';

Vue.use( Vuex );

const store = new Vuex.Store( storeConfig );

export default store;
