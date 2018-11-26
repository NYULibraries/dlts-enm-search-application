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
        addSelectedTopicFacetItem( state, topicFacetItem ) {
            state.selectedTopicFacetItems.push( topicFacetItem );
        },
        removeSelectedTopicFacetItem( state, topicFacetItem ) {
            const index = state.selectedTopicFacetItems.indexOf( topicFacetItem );
            if ( index > -1 ) {
                state.selectedTopicFacetItems.splice( index, 1 );
            }
        },
        setQuery( state, query ) {
            state.query = query;
        },
        setQueryFields( state, queryFields ) {
            state.queryFields = queryFields;
        },
    },
    actions: {
        addSelectedTopicFacetItem( { commit }, topicFacetItem ) {
            commit( 'addSelectedTopicFacetItem', topicFacetItem );
        },
        removeSelectedTopicFacetItem( { commit }, topicFacetItem ) {
            commit( 'removeSelectedTopicFacetItem', topicFacetItem );
        },
        setQuery( { commit }, query ) {
            commit( 'setQuery', query );
        },
        setQueryFields( { commit }, queryFields ) {
            commit( 'setQueryFields', queryFields );
        },
    },
} );

export default store;
