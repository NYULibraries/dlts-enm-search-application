import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

function createLocalVueWithVuex() {
    const localVue = createLocalVue();

    localVue.use( Vuex );

    return localVue;
}

function createStore( query, queryFields, selectedTopicFieldFacetItems ) {
    const getters = {
        query                   : () => query,
        queryFields             : () => queryFields,
        selectedTopicFacetItems : () => selectedTopicFieldFacetItems,
    };

    return new Vuex.Store(
        {
            getters,
        }
    );
}

export {
    createLocalVueWithVuex,
    createStore,
};
