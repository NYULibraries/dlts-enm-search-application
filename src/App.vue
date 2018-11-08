<template>
    <div id="app">
        <button
            id="debug"
            @click="debugSearch">DEBUG</button>
        <div>{{ debug }}</div>
        <search-form/>
        <div v-cloak>
            <search-echo/>
            <div class="container is-fluid">
                <div class="columns enm-panes">
                    <facet-pane/>
                    <results-pane/>
                    <preview-pane/>
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
        async solrSearch() {
            const response = await this.$solrSearch( 'art', [ 'pageText', 'topicNames' ] );

            return response;
        },
    },
};

</script>

<style>
    [v-cloak] { display: none; }
</style>
