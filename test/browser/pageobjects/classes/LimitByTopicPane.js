/* global $:false $$:false */

class LimitByTopicPane {
    get seeAllLink() {
        return $( 'a=See All' );
    }

    get seeLessLink() {
        return $( 'a=See Less' );
    }

    get togglableTopicsGroup() {
        return $( '.enm-facets-group-togglable a' );
    }

    get topicNames() {
        return this.topicNamesWithHitCounts.map( ( topicNameWithHitCount ) => {
            return topicNameWithHitCount[ 0 ];
        } );
    }

    get topicNamesWithHitCounts() {
        if ( this.togglableTopicsGroup.isVisible() ) {
            return this.topicNamesWithHitCountsGroupVisible.concat(
                this.topicNamesWithHitCountsGroupTogglable
            );
        } else {
            return this.topicNamesWithHitCountsGroupVisible;
        }
    }

    get topicNamesWithHitCountsGroupTogglable() {
        // Empty unless user has clicked "See all"
        return $$( '.enm-facets-group-togglable a' ).map(
            ( topicItem ) => {
                const found = topicItem.getText().match( /^(.*) \((\d+)\)$/ );
                return [ found[ 1 ], parseInt( found[ 2 ], 10 ) ];
            }
        );
    }

    get topicNamesWithHitCountsGroupVisible() {
        return $$( '.enm-facets-group-visible a' ).map(
            ( topicItem ) => {
                const found = topicItem.getText().match( /^(.*) \((\d+)\)$/ );
                return [ found[ 1 ], parseInt( found[ 2 ], 10 ) ];
            }
        );
    }

    topic( topic ) {
        return $( 'a[ id = "' + topic.replace( /"/g, '\\"' ) + '" ]' );
    }
}

export default LimitByTopicPane;
