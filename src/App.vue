<template>
    <div id="app">
        <search-form @submit="solrSearch"/>
        <div v-cloak>
            <search-echo
                :display="searchEcho.display"
                :selected-topic-facet-items="searchEcho.selectedTopicFacetItems"
            />
            <div class="container is-fluid">
                <div class="columns enm-panes">
                    <facet-pane
                        :display="facetPane.display"
                        :topics-facet-list="facetPane.topicsFacetList"
                        :topics-facet-list-limit="facetPane.topicsFacetListLimit"
                    />

                    <spinner :display="spinner.display"/>

                    <results-pane
                        :display="resultsPane.display"
                        :num-books="resultsPane.numBooks"
                        :num-pages="resultsPane.numPages"
                        :results="resultsPane.results"
                        :search-in-progress="false"
                    />
                    <preview-pane
                        :display="previewPane.display"
                        isbn="previewPane.isbn"
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
            facetPane: {
                display: false,
                topicsFacetList: null,
                topicsFacetListLimit: 15,
            },
            previewPane: {
                display: false,
                isbn: null,
            },
            resultsPane: {
                display: false,
                numBooks: null,
                numPages: null,
                resuts: null,
            },
            searchEcho: {
                display: false,
                selectedTopicFacetItems: null,
            },
            spinner: {
                display: false,
            },
        };
    },
    methods : {
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
            this.spinner.display = true;

            const response = await this.$solrSearch( query, queryFields );

            this.spinner.display = false;

            return response;
        },
    },
};

</script>

<style>
    [v-cloak] { display: none; }
</style>
