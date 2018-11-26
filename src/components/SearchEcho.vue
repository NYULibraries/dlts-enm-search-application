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
        queryFieldsUI : {
            type     : Array,
            required : true,
            default  : null,
        },
    },
    data() {
        return {
            queryFieldsByValueMap : {},
        };
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
            const that = this;

            if ( this.query && this.query !== '' ) {
                const selectedQueryFieldsDCILabels = this.queryFields.map(
                    function ( selectedQueryField ) {
                        return that.queryFieldsByValueMap[ selectedQueryField ].dciLabel;
                    }
                );

                return 'Searching ' +
                       selectedQueryFieldsDCILabels
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
    created() {
        this.queryFieldsUI.forEach( queryField => {
            this.queryFieldsByValueMap[ queryField.value ] = queryField;
        } );
    },
    methods: {
        ...mapActions(
            [
                'removeSelectedTopicFacetItem',
                'setQuery',
                'setQueryFields',
            ]
        ),
        clickDeleteSearchDCI() {
            this.$emit( 'search-dci-dismiss', event.currentTarget.id );
        },
        clickDeleteTopicDCI( event ) {
            this.removeSelectedTopicFacetItem( event.currentTarget.id );
        },
    },
};
</script>

<style>
</style>
