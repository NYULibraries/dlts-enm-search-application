<template>
    <div id="app">
        <button
            id="debug"
            @click="debugSearch">DEBUG</button>
        <div>{{ debug }}</div>
        <search-form @submit="solrSearch"/>
        <div v-cloak>
            <search-echo
                :selected-topic-facet-items="[ 'Topic1', 'Topic2', ]"
                display
            />
            <div class="container is-fluid">
                <div class="columns enm-panes">
                    <facet-pane
                        :topics-facet-list="[ 'Topic1', 'Topic2', ]"
                        :topics-facet-list-limit="15"
                        display
                    />

                    <spinner display/>

                    <results-pane
                        :num-books="10"
                        :num-pages="100"
                        :results="[]"
                        :search-in-progress="false"
                        display
                    />
                    <preview-pane
                        display
                        isbn="9780814712917"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FacetPane from './components/FacetPane';
import PreviewPane from './components/PreviewPane';
import ResultsPane from './components/ResultsPane';
import SearchEcho from './components/SearchEcho';
import SearchForm from './components/SearchForm';
import Spinner from './components/Spinner';
export default {
    name: 'App',
    components : {
        FacetPane,
        PreviewPane,
        ResultsPane,
        SearchEcho,
        SearchForm,
        Spinner,
    },
    data() {
        return {
            debug : null,
        };
    },
    methods : {
        async debugSearch() {
            // this.debug = await this.solrPreviewEpub();
            this.debug = await this.solrPreviewPage();
            // this.debug = await this.solrSearch();
        },
        async solrPreviewEpub() {
            const response = await this.$solrPreviewEpub(
                '9780472024490',
                'art',
                [ 'pageText', 'topicNames' ],
                [ 'postmodernism', 'Hutcheon, Linda' ],
            );

            return response;
        },
        async solrPreviewPage() {
            const response = await this.$solrPreviewPage(
                '9780472024490',
                88,
                'art',
                [ 'pageText', 'topicNames' ],
            );

            return response;
        },
        async solrSearch( query, queryFields ) {
            const response = await this.$solrSearch( query, queryFields );

            return response;
        },
    },
};

</script>

<style>
    [v-cloak] { display: none; }
</style>
