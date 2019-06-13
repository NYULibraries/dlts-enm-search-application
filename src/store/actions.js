export default {
    addSelectedTopicFacetItem( { commit }, topicFacetItem ) {
        commit( 'addSelectedTopicFacetItem', topicFacetItem );
    },
    clearSelectedTopicFacetItems( { commit } ) {
        commit( 'clearSelectedTopicFacetItems' );
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
};
