<template>
    <div class="column enm-pane enm-pane-facets is-2">

        <div
            v-show="display"
            class="content">
            <h2 class="enm-pane-heading is-size-5">Limit by Topic</h2>

            <div class="enm-facets-list">
                <div class="enm-topics enm-facets-group-visible">

                    <a
                        v-for="topic in topicFacetItemsAlwaysVisible"
                        :key="topic.name"
                        :id="topic.name"
                        href="#"
                        @click="clickTopicFacetItem">
                        {{ topic.name }}
                        <span class="enm-hitcount">({{ topic.numHits }})</span>
                    </a>

                </div>

                <a
                    v-show="( ! showAllTopics ) && ( topicsFacetList.length > topicsFacetListLimit )"
                    class="listui seemore"
                    href="#"
                    @click="showAllTopics = ! showAllTopics">
                    <i
                        class="fa fa-angle-double-down"
                        aria-hidden="true"></i>See All
                </a>

                <div
                    v-show="( showAllTopics ) && ( topicsFacetList.length > topicsFacetListLimit )"
                    class="enm-topics enm-facets-group-togglable">

                    <a
                        v-for="topic in topicFacetItemsToggleable"
                        :key="topic.name"
                        :id="topic.name"
                        href="#"
                        @click="clickTopicFacetItem">
                        {{ topic.name }}
                        <span class="enm-hitcount">({{ topic.numHits }})</span>
                    </a>

                </div>

                <a
                    v-show="( showAllTopics ) && ( topicsFacetList.length > topicsFacetListLimit )"
                    class="listui seemore"
                    href="#"
                    @click="showAllTopics = ! showAllTopics">
                    <i
                        class="fa fa-angle-double-up"
                        aria-hidden="true"></i>See Less
                </a>

            </div>

        </div>

    </div>
</template>

<script>
const DEFAULT_TOPIC_FACET_LIST_LIMIT = 15;

export default {
    name: 'FacetPane',
    props: {
        display: {
            type     : Boolean,
            required : true,
            default  : false,
        },
        topicsFacetList: {
            type : Array,
            required: true,
            default: function () {
                return null;
            },
        },
        topicsFacetListLimit: {
            type : Number,
            required: true,
            default: function () {
                return DEFAULT_TOPIC_FACET_LIST_LIMIT;
            },
        },
    },
    data() {
        return {
            selectedTopicFacetItems: [],
            showAllTopics: false,
        };
    },
    computed: {
        topicFacetListSelectedItemsRemoved() {
            const topicFacetListSelectedItemsRemoved = this.topicsFacetList.slice();

            // Remove topics already selected by user
            this.selectedTopicFacetItems.forEach( ( selectedTopic ) => {
                const found = topicFacetListSelectedItemsRemoved.findIndex(
                    ( element ) => {
                        return element.name === selectedTopic;
                    }
                );

                if ( found !== -1 ) {
                    topicFacetListSelectedItemsRemoved.splice( found, 1 );
                }
            } );

            return topicFacetListSelectedItemsRemoved;
        },
        topicFacetItemsAlwaysVisible() {
            return this.topicFacetListSelectedItemsRemoved.slice( 0, this.topicsFacetListLimit );
        },
        topicFacetItemsToggleable() {
            if ( this.showAllTopics ) {
                return this.topicFacetListSelectedItemsRemoved.slice( this.topicsFacetListLimit );
            } else {
                return [];
            }
        },
    },
    watch: {
        topicsFacetList( oldList, newList ) {
            this.showAllTopics = false;
        },
    },
    methods: {
        clickTopicFacetItem( event ) {
            // Event name is awkward looking, but convention for native events
            // seems to be noun-verb all lowercase:
            // https://developer.mozilla.org/en-US/docs/Web/Events
            this.selectedTopicFacetItems.push( event.currentTarget.id );
            // Pass a copy back to parent
            this.$emit( 'topicclick', this.selectedTopicFacetItems.slice() );
        },
    },
};
</script>

<style>
</style>
