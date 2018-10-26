<template>
    <div class="column enm-pane enm-pane-facets is-2">

        <div class="content" v-show="displayFacetPane">
            <h2 class="enm-pane-heading is-size-5">Limit by Topic</h2>

            <div class="enm-facets-list">
                <div class="enm-topics enm-facets-group-visible">

                    <a href="#"
                       v-for="topic in topicFacetItemsAlwaysVisible"
                       v-on:click="clickTopicFacetItem"
                       v-bind:id="topic.name">
                        {{ topic.name }}
                        <span class="enm-hitcount">({{ topic.numHits }})</span>
                    </a>

                </div>

                <a class="listui seemore" href="#"
                   v-show="( ! facetPane.showAllTopics )
                         &&
                        ( facetPane.topicsFacetList.length > facetPane.topicsFacetListLimit )"
                   v-on:click="facetPane.showAllTopics = ! facetPane.showAllTopics">
                    <i class="fa fa-angle-double-down" aria-hidden="true"></i>See All
                </a>

                <div class="enm-topics enm-facets-group-togglable"
                     v-show="( facetPane.showAllTopics )
                          &&
                          ( facetPane.topicsFacetList.length > facetPane.topicsFacetListLimit )">

                    <a href="#"
                       v-for="topic in topicFacetItemsToggleable"
                       v-on:click="clickTopicFacetItem"
                       v-bind:id="topic.name">
                        {{ topic.name }}
                        <span class="enm-hitcount">({{ topic.numHits }})</span>
                    </a>

                </div>

                <a class="listui seemore" href="#"
                   v-show="( facetPane.showAllTopics )
                         &&
                        ( facetPane.topicsFacetList.length > facetPane.topicsFacetListLimit )"
                   v-on:click="facetPane.showAllTopics = ! facetPane.showAllTopics">
                    <i class="fa fa-angle-double-up" aria-hidden="true"></i>See Less
                </a>

            </div>

        </div>

    </div>
</template>

<script>
export default {
    name: 'FacetPane',
};
</script>

<style>
</style>
