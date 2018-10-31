<template>
    <div class="column enm-pane enm-pane-facets is-2">

        <div v-show="displayFacetPane" class="content">
            <h2 class="enm-pane-heading is-size-5">Limit by Topic</h2>

            <div class="enm-facets-list">
                <div class="enm-topics enm-facets-group-visible">

                    <a
                       v-for="topic in topicFacetItemsAlwaysVisible"
                       :key="topic.name"
                       v-on:click="clickTopicFacetItem"
                       :id="topic.name"
                       href="#">
                        {{ topic.name }}
                        <span class="enm-hitcount">({{ topic.numHits }})</span>
                    </a>

                </div>

                <a
                   v-show="( ! facetPane.showAllTopics )
                         &&
                        ( facetPane.topicsFacetList.length > facetPane.topicsFacetListLimit )"
                   @click="facetPane.showAllTopics = ! facetPane.showAllTopics"
                   class="listui seemore" href="#">
                    <i class="fa fa-angle-double-down" aria-hidden="true"></i>See All
                </a>

                <div
                     v-show="( facetPane.showAllTopics )
                          &&
                          ( facetPane.topicsFacetList.length > facetPane.topicsFacetListLimit )"
                     class="enm-topics enm-facets-group-togglable">

                    <a
                       v-for="topic in topicFacetItemsToggleable"
                       :key="topic.name"
                       @click="clickTopicFacetItem"
                       :id="topic.name"
                       href="#">
                        {{ topic.name }}
                        <span class="enm-hitcount">({{ topic.numHits }})</span>
                    </a>

                </div>

                <a
                   v-show="( facetPane.showAllTopics )
                         &&
                        ( facetPane.topicsFacetList.length > facetPane.topicsFacetListLimit )"
                   @click="facetPane.showAllTopics = ! facetPane.showAllTopics"
                   class="listui seemore" href="#">
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
