<template>
    <section class="hero is-primary enm-searchbox-hero">
        <div class="hero-body">
            <div class="container is-fluid">
                <form
                    class="enm-searchform"
                    @submit.prevent="submitSearchForm">
                    <div class="enm-searchbox">
                        <div class="field columns level">
                            <div class="column level-item">
                                <p class="control has-icons-left">
                                    <label
                                        class="enm-visually-hidden"
                                        for="enm-searchinput">Search inside all books</label>
                                    <input
                                        id="enm-searchinput"
                                        v-model="queryUI"
                                        class="input is-large"
                                        type="text"
                                        placeholder="Search inside all books">
                                    <span class="icon is-small is-left">
                                        <i class="fa fa-search"></i>
                                    </span>
                                </p>
                            </div>

                            <div class="column is-narrow">

                                <template v-for="queryFieldUI in queryFieldsUI">
                                    <input
                                        :name="queryFieldUI.name + 'Chx'"
                                        :id="queryFieldUI.name + 'Chx'"
                                        :key="queryFieldUI.name"
                                        :value="queryFieldUI.value"
                                        v-model="selectedQueryFields"
                                        type="checkbox"
                                        class="is-medium is-checkbox">
                                    <label
                                        :for="queryFieldUI.name + 'Chx'"
                                        :key="queryFieldUI.label"
                                        class="">
                                        {{ queryFieldUI.label }}
                                    </label>
                                </template>

                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'SearchForm',
    props : {
        queryFieldsUI : {
            type     : Array,
            required : true,
            default  : null,
        },
    },
    data() {
        return {
            queryUI : null,

            selectedQueryFields: this.queryFieldsUI.map(
                ( queryField ) => { return queryField.value; }
            ),
        };
    },
    computed : {
        ...mapGetters(
            [
                'query',
                'queryFields',
                'selectedTopicFacetItems',
            ]
        ),
    },
    watch : {
        query( newValue, oldValue ) {
            // This watcher is for updating the form when another component
            // changes the query.  Note that this watcher forms a loop in the case of
            // the user submitting a new query via this component's own form,
            // since the submit form code changes the query.  It's a very fast
            // and finite loop however, and there may in fact come a time when in
            // the loop we would want to change the queryUI value -- for example,
            // for stopword removal or some other query rewrite that happens on
            // submission.
            // The loop could be broken by moving queryUI from data to props and
            // having App set it when another component changes the query, but
            // doing that doesn't seem worth the added complexity.
            this.queryUI = newValue;
        },
    },
    methods: {
        ...mapActions(
            [
                'addSelectedTopicFacetItems',
                'removeSelectedTopicFacetItems',
                'setQuery',
                'setQueryFields',
            ]
        ),
        submitSearchForm() {
            if ( this.selectedQueryFields.length === 0 ) {
                alert( 'Please check one or more boxes: ' +
                       this.queryFieldsUI.map(
                           ( e ) => { return e.label; }
                       ).join( ', ' )
                );

                return;
            }

            this.setQuery( this.queryUI );
            this.setQueryFields( this.selectedQueryFields );

            this.$emit( 'submit' );
        },
    },
};
</script>

<style>
</style>
