<template>
    <section class="hero searchecho">
        <div class="container is-fluid">
            <div class="columns enm-searchecho">

                <div class="column">
                    <span
                        v-show="searchDCI && display"
                        class="tag">
                        {{ searchDCI }}
                        <button
                            id="search-dci"
                            class="delete is-small"
                            @click="clickDeleteSearchDCI"></button>
                    </span>

                    <span
                        v-for="topicDCI in topicDCIs"
                        :key="topicDCI.id"
                        class="tag">
                        Topic:&nbsp;<span class="enm-topic">{{ topicDCI.topic }}</span>
                        <button
                            :id="topicDCI.id"
                            class="delete is-small"
                            @click="clickDeleteTopicDCI"></button>
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'SearchEcho',
    props: {
        display: {
            type: Boolean,
            required: true,
            default: false,
        },
        query: {
            type: String,
            required: true,
            default: null,
        },
        selectedQueryFieldsDCILabels: {
            type: Array,
            required: false,
            default: function () {
                return null;
            },
        },
        selectedTopicFacetItems: {
            type: Array,
            required: false,
            default: function () {
                return null;
            },
        },
    },
    computed: {
        searchDCI() {
            if ( this.query && this.query !== '' ) {
                this.searchDCI = 'Searching ' + this.selectedQueryFieldsDCILabels
                    .sort().join( ' and ' ) + ' for: ' + this.query;
            } else {
                this.searchDCI = null;
            }
        },
        topicDCIs() {
            return this.selectedTopicFacetItems.map( ( topic ) => {
                return {
                    id: topic,
                    topic: topic,
                };
            } );
        },
    },
    methods: {
        clickDeleteSearchDCI() {

        },
        clickDeleteTopicDCI() {

        },
    },
};
</script>

<style>
</style>
