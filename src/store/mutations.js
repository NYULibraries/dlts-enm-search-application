export default {
    addSelectedTopicFacetItem( state, topicFacetItem ) {
        if ( typeof topicFacetItem === 'string' && topicFacetItem !== '' ) {
            state.selectedTopicFacetItems.push( topicFacetItem );
        } else {
            console.error( `Invalid argument passed to addSelectedTopicFacetItem: ` +
                           ( topicFacetItem === '' ? '[empty string]' : topicFacetItem )
            );
        }
    },
    clearSelectedTopicFacetItems( state ) {
        state.selectedTopicFacetItems = [];
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
};
