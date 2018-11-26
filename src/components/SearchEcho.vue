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
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'SearchEcho',
    props : {
        display                      : {
            type     : Boolean,
            required : true,
            default  : false,
        },
        selectedQueryFieldsDCILabels : {
            type     : Array,
            required : false,
            default  : function () {
                return null;
            },
        },
    },
    computed: {
        ...mapGetters(
            [
                'query',
                'queryFields',
                'selectedTopicFacetItems',
            ]
        ),
        searchDCI() {
            if ( this.query && this.query !== '' ) {
                return 'Searching ' +
                       this.selectedQueryFieldsDCILabels
                           .slice()
                           .sort().join( ' and ' ) + ' for: ' + this.query;
            } else {
                return null;
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
        ...mapActions(
            [
                'removeSelectedTopicFacetItems',
                'setQuery',
                'setQueryFields',
            ]
        ),
        clickDeleteSearchDCI() {
            this.$emit( 'search-dci-dismiss', event.currentTarget.id );
        },
        clickDeleteTopicDCI( event ) {
            this.$emit( 'topic-dci-dismiss', event.currentTarget.id );
        },
    },
};
</script>

<style>
</style>
