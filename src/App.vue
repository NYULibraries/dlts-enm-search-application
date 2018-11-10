<template>
    <div id="app">
        <search-form
            :query-fields="searchForm.queryFields"
            @submit="solrSearch"/>
        <div v-cloak>
            <search-echo
                :display="searchEcho.display"
                :query="searchEcho.query"
                :selected-query-fields-d-c-i-labels="searchEcho.selectedQueryFieldsDCILabels"
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

const QUERY_FIELDS = [
    {
        dciLabel : 'full texts',
        label    : 'Full Text',
        name     : 'fulltext',
        value    : 'pageText',
    },
    {
        dciLabel : 'topics',
        label    : 'Topics',
        name     : 'topics',
        value    : 'topicNames',
    },
];

const QUERY_FIELDS_BY_VALUE = ( function () {
    const queryFieldsByValueMap = {};

    QUERY_FIELDS.forEach( function ( queryField ) {
        queryFieldsByValueMap[ queryField.value ] = queryField;
    } );

    return queryFieldsByValueMap;
} )();

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
                topicsFacetList: [],
                topicsFacetListLimit: 15,
            },
            previewPane: {
                display: false,
                isbn: null,
            },
            resultsPane: {
                display: false,
                numBooks: 0,
                numPages: 0,
                results: [],
            },
            searchEcho: {
                display: false,
                query: '',
                selectedQueryFieldsDCILabels: null,
                selectedTopicFacetItems: [],
            },
            searchForm: {
                queryFields: QUERY_FIELDS,
            },
            spinner: {
                display: false,
            },
        };
    },
    methods : {
        displayAllPanes() {
            this.setPanesDisplay(
                [
                    this.searchEcho,
                    this.facetPane,
                    this.resultsPane,
                    this.previewPane,
                ],
                true
            );
        },
        setPanesDisplay( panes, state ) {
            panes.forEach( ( pane ) => {
                pane.display = state;
            } );
        },
        hideAllPanes() {
            this.setPanesDisplay(
                [
                    this.searchEcho,
                    this.facetPane,
                    this.resultsPane,
                    this.previewPane,
                ],
                false
            );
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
            this.hideAllPanes();

            this.spinner.display = true;

            const response = await this.$solrSearch( query, queryFields );

            this.spinner.display = false;

            this.searchEcho.query = query;
            this.searchEcho.selectedQueryFieldsDCILabels = queryFields.map(
                function ( selectedQueryField ) {
                    return QUERY_FIELDS_BY_VALUE[ selectedQueryField ].dciLabel;
                }
            );
            this.searchEcho.selectedTopicFacetItems = [];

            this.displayAllPanes();

            return response;
        },
    },
};

</script>

<style>
    [v-cloak] { display: none; }
</style>
