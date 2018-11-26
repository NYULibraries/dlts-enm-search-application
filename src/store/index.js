import Vue from 'vue';
import Vuex from 'vuex';

Vue.use( Vuex );

const store = new Vuex.Store( {
    strict: process.env.NODE_ENV !== 'production',

    state() {
        return {
            query: null,
            queryFields: null,
            selectedTopicFacetItems: null,
        };
    },
    getters: {
        query: state => state.query,

        queryFields: state => state.queryFields,

        selectedTopicFacetItems: state => state.queryFields,
    },
    mutations: {
        setQuery( state, query ) {
            state.query = query;
        },
        setQueryFields( state, queryFields ) {
            state.queryFields = queryFields;
        },
        setSelectedTopicFacetItems( state, selectedTopicFacetItems ) {
            state.selectedTopicFacetItems = selectedTopicFacetItems;
        },
    },
    actions: {
        setQuery( { commit }, query ) {
            commit( 'setQuery', query );
        },
        setQueryFields( { commit }, queryFields ) {
            commit( 'setQueryFields', queryFields );
        },
        setSelectedTopicFacetItems( { commit }, setSelectedTopicFacetItems ) {
            commit( 'setSelectedTopicFacetItems', setSelectedTopicFacetItems );
        },
    },
} );

export default store;
