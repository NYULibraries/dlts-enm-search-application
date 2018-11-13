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
                                        v-model="query"
                                        class="input is-large"
                                        type="text"
                                        placeholder="Search inside all books">
                                    <span class="icon is-small is-left">
                                        <i class="fa fa-search"></i>
                                    </span>
                                </p>
                            </div>

                            <div class="column is-narrow">

                                <template v-for="queryField in queryFields">
                                    <input
                                        :name="queryField.name + 'Chx'"
                                        :id="queryField.name + 'Chx'"
                                        :key="queryField.name"
                                        :value="queryField.value"
                                        v-model="selectedQueryFields"
                                        type="checkbox"
                                        class="is-medium is-checkbox">
                                    <label
                                        :for="queryField.name + 'Chx'"
                                        :key="queryField.label"
                                        class="">
                                        {{ queryField.label }}
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
export default {
    name: 'SearchForm',
    props: {
        queryOverride: {
            type: String,
            required: true,
            default: null,
        },
        queryFields: {
            type: Array,
            required: true,
            default: null,
        },
    },
    data() {
        return {
            query: '',
            selectedQueryFields: this.queryFields.map(
                ( queryField ) => { return queryField.value; }
            ),
        };
    },
    watch: {
        queryOverride( newQuery, oldQuery ) {
            this.query = newQuery;
        },
    },
    methods: {
        submitSearchForm() {
            if ( this.selectedQueryFields.length === 0 ) {
                alert( 'Please check one or more boxes: ' +
                       this.queryFields.map(
                           ( e ) => { return e.label; }
                       ).join( ', ' )
                );

                return;
            }

            this.$emit( 'submit', this.query, this.selectedQueryFields );
        },
    },
};
</script>

<style>
</style>
