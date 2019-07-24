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
        if ( Array.isArray( queryFields ) ) {
            state.queryFields = queryFields;
        } else {
            console.error( `Invalid argument passed to queryFields: ` +
                           ( Array.isArray( queryFields ) && queryFields.length === 0
                               ? '[empty array]'
                               : queryFields )
            );
            state.queryFields = [];
        }
    },
};
